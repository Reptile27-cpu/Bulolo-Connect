import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { prisma } from '../config/database';
import { config } from '../config';
import { generateAccountId } from '../utils/reference';
import { recordAuditLog } from '../middleware/audit';

const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  phoneNumber: z.string().min(7, 'A valid mobile phone number is required'),
  email: z.string().email().optional().or(z.literal('')),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  province: z.string().default('Morobe Province'),
  district: z.string().default('Bulolo District'),
  llg: z.string().min(1, 'Local Level Government is required'),
  ward: z.string().min(1, 'Ward is required'),
  village: z.string().min(1, 'Village or community is required'),
  residentialLocation: z.string().min(1, 'Residential location is required'),
  isDiaspora: z.boolean().default(false),
  preferredLanguage: z.enum(['en', 'tpi']).default('en')
});

const loginSchema = z.object({
  identifier: z.string().min(1, 'Phone number or email is required'),
  password: z.string().min(1, 'Password is required')
});

export async function register(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const data = registerSchema.parse(req.body);

    // Check if phone number already exists
    const existingPhone = await prisma.user.findUnique({
      where: { phoneNumber: data.phoneNumber }
    });
    if (existingPhone) {
      res.status(409).json({
        success: false,
        message: 'An account with this mobile phone number is already registered.'
      });
      return;
    }

    if (data.email) {
      const existingEmail = await prisma.user.findUnique({
        where: { email: data.email }
      });
      if (existingEmail) {
        res.status(409).json({
          success: false,
          message: 'An account with this email address is already registered.'
        });
        return;
      }
    }

    // Determine account sequence count
    const count = await prisma.user.count();
    const accountId = generateAccountId(count + 1);

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const result = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          accountId,
          phoneNumber: data.phoneNumber,
          email: data.email || null,
          passwordHash,
          role: 'CITIZEN',
          preferredLanguage: data.preferredLanguage,
          isVerified: true
        }
      });

      const citizenProfile = await tx.citizenProfile.create({
        data: {
          userId: newUser.id,
          fullName: data.fullName,
          province: data.province,
          district: data.district,
          llg: data.llg,
          ward: data.ward,
          village: data.village,
          residentialLocation: data.residentialLocation,
          isDiaspora: data.isDiaspora
        }
      });

      // Create welcome notification
      await tx.notification.create({
        data: {
          userId: newUser.id,
          title: data.preferredLanguage === 'tpi' ? 'Bung gudpela long Bulolo Connect!' : 'Welcome to Bulolo Connect!',
          message: data.preferredLanguage === 'tpi' 
            ? `Akaun bilong yu (${accountId}) i redi pinis. Yu ken lukim ol sevis, salim hevi, o askim halivim long distrik ofis.`
            : `Your citizen account (${accountId}) is active. You can now submit requests, track development, and apply for district assistance.`,
          type: 'SYSTEM'
        }
      });

      return { user: newUser, citizenProfile };
    });

    const userPayload = {
      id: result.user.id,
      accountId: result.user.accountId,
      fullName: result.citizenProfile.fullName,
      email: result.user.email || undefined,
      phoneNumber: result.user.phoneNumber,
      role: result.user.role,
      preferredLanguage: result.user.preferredLanguage,
      isVerified: result.user.isVerified,
      citizenProfileId: result.citizenProfile.id
    };

    const token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '7d' });

    await recordAuditLog(result.user.id, 'CITIZEN_REGISTERED', 'User', result.user.id, req, {
      accountId,
      llg: data.llg,
      ward: data.ward
    });

    res.status(201).json({
      success: true,
      message: 'Citizen account successfully created.',
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
}

export async function login(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    const { identifier, password } = loginSchema.parse(req.body);

    // Search by phone or email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { phoneNumber: identifier },
          { email: identifier },
          { accountId: identifier }
        ]
      },
      include: {
        citizenProfile: true,
        staffProfile: true
      }
    });

    if (!user) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please verify your phone number or password.' });
      return;
    }

    if (!user.isActive) {
      res.status(403).json({ success: false, message: 'This account has been deactivated. Please contact the Bulolo District Administration.' });
      return;
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      res.status(401).json({ success: false, message: 'Invalid credentials. Please check your password.' });
      return;
    }

    // Update last login
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    });

    const fullName = user.citizenProfile?.fullName || user.staffProfile?.fullName || 'Bulolo Resident';

    const userPayload = {
      id: user.id,
      accountId: user.accountId,
      fullName,
      email: user.email || undefined,
      phoneNumber: user.phoneNumber,
      role: user.role,
      preferredLanguage: user.preferredLanguage,
      isVerified: user.isVerified,
      assignedLlgId: user.staffProfile?.assignedLlgId || undefined,
      citizenProfileId: user.citizenProfile?.id || undefined
    };

    const token = jwt.sign(userPayload, config.jwtSecret, { expiresIn: '7d' });

    await recordAuditLog(user.id, 'USER_LOGIN', 'User', user.id, req);

    res.json({
      success: true,
      message: 'Signed in successfully.',
      token,
      user: userPayload
    });
  } catch (error) {
    next(error);
  }
}

export async function getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        citizenProfile: {
          include: {
            household: {
              include: {
                members: true
              }
            }
          }
        },
        staffProfile: true
      }
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User record not found' });
      return;
    }

    const { passwordHash, ...safeUser } = user;
    res.json({ success: true, profile: safeUser });
  } catch (error) {
    next(error);
  }
}
