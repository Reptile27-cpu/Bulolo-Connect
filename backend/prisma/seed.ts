import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Bulolo Connect Database Seed...');

  const isProduction = process.env.NODE_ENV?.trim() === 'production';
  const seedDemoData = process.env.SEED_DEMO_DATA?.trim() === 'true';

  if (isProduction && seedDemoData) {
    throw new Error('Security Violation: SEED_DEMO_DATA cannot be true when NODE_ENV=production. Aborting seed process.');
  }

  const shouldSeedDemoData = seedDemoData && !isProduction;

  // ===========================================================================
  // 1. GENUINE ADMINISTRATIVE GEOGRAPHY (Production-Safe & Verified)
  // These represent the official, authentic local-level governments of Bulolo District.
  // ===========================================================================
  const district = await prisma.district.upsert({
    where: { code: 'BULOLO' },
    update: {},
    create: {
      name: 'Bulolo District',
      province: 'Morobe Province',
      code: 'BULOLO',
      capital: 'Bulolo Town'
    }
  });

  await prisma.lLG.upsert({
    where: { code: 'MUMENG' },
    update: {},
    create: {
      districtId: district.id,
      name: 'Mumeng Rural LLG',
      code: 'MUMENG',
      type: 'RURAL',
      headquarters: 'Mumeng Station',
      description: 'Highway corridor, poultry farming, Zenag hub, Sambio and Patep valleys.'
    }
  });

  await prisma.lLG.upsert({
    where: { code: 'WATUT' },
    update: {},
    create: {
      districtId: district.id,
      name: 'Watut Rural LLG',
      code: 'WATUT',
      type: 'RURAL',
      headquarters: 'Maralina',
      description: 'Upper, Middle, and Lower Watut River basins with cocoa, coffee and alluvial mining communities.'
    }
  });

  await prisma.lLG.upsert({
    where: { code: 'BUANG' },
    update: {},
    create: {
      districtId: district.id,
      name: 'Buang Rural LLG',
      code: 'BUANG',
      type: 'RURAL',
      headquarters: 'Mangga',
      description: 'Mountain ridge farming, Arabica coffee, highland vegetables and community cooperatives.'
    }
  });

  await prisma.lLG.upsert({
    where: { code: 'BULOLO_URBAN' },
    update: {},
    create: {
      districtId: district.id,
      name: 'Bulolo Urban LLG',
      code: 'BULOLO_URBAN',
      type: 'URBAN',
      headquarters: 'Bulolo Town Civic Centre',
      description: 'Commercial, civic administration, timber milling, and forestry education centre.'
    }
  });

  console.log('✅ Official administrative geography initialized: Bulolo District, Mumeng, Watut, Buang, Bulolo Urban LLGs.');

  // ===========================================================================
  // 2. DEMO / SAMPLE DATASET (Guarded: Never created in production)
  // All items below are sample/evaluation records with placeholder credentials and mock content.
  // ===========================================================================
  if (!shouldSeedDemoData) {
    if (isProduction) {
      console.log('🛡️ Production mode (NODE_ENV=production):');
      console.log('   Skipped all sample services, assistance programmes, development projects, announcements, and demo accounts.');
      console.log('   Zero unverified or sample records were written to production database.');
    } else {
      console.log('ℹ️ Demo dataset skipped (requires SEED_DEMO_DATA=true in non-production).');
      console.log('   No sample records or demo user accounts were created.');
    }
  } else {
    console.log('🧪 Seeding evaluation demo dataset (SEED_DEMO_DATA=true)...');

    // 2.1 Demo Credentials Setup (Dynamic, no hardcoded secrets)
    const adminPassword = process.env.DEMO_ADMIN_PASSWORD || crypto.randomBytes(16).toString('hex');
    const citizenPassword = process.env.DEMO_CITIZEN_PASSWORD || crypto.randomBytes(16).toString('hex');

    const adminPasswordHash = await bcrypt.hash(adminPassword, 12);
    const citizenPasswordHash = await bcrypt.hash(citizenPassword, 12);

    if (process.env.DEMO_ADMIN_PASSWORD) {
      console.log('🔑 Demo Admin Password loaded from DEMO_ADMIN_PASSWORD environment variable.');
    } else {
      console.log(`🔑 Generated random Demo Admin Password: ${adminPassword}`);
    }

    if (process.env.DEMO_CITIZEN_PASSWORD) {
      console.log('🔑 Demo Citizen Password loaded from DEMO_CITIZEN_PASSWORD environment variable.');
    } else {
      console.log(`🔑 Generated random Demo Citizen Password: ${citizenPassword}`);
    }

    // 2.2 Sample Administrative Staff Users
    await prisma.user.upsert({
      where: { accountId: 'BC-USR-2026-0001' },
      update: {},
      create: {
        accountId: 'BC-USR-2026-0001',
        email: 'admin@buloloconnect.gov.pg',
        phoneNumber: '+67570000001',
        passwordHash: adminPasswordHash,
        role: 'SUPER_ADMIN',
        preferredLanguage: 'en',
        isVerified: true,
        staffProfile: {
          create: {
            fullName: 'Kila Vele (Demo Super Admin)',
            staffIdNumber: 'STAFF-BD-001',
            department: 'District ICT & Systems Governance',
            positionTitle: 'Chief Systems Administrator',
            officeLocation: 'Bulolo District Administration Civic Centre'
          }
        }
      }
    });

    await prisma.user.upsert({
      where: { accountId: 'BC-USR-2026-0002' },
      update: {},
      create: {
        accountId: 'BC-USR-2026-0002',
        email: 'mp.office@buloloconnect.gov.pg',
        phoneNumber: '+67570000002',
        passwordHash: adminPasswordHash,
        role: 'MP_OFFICE_REP',
        preferredLanguage: 'en',
        isVerified: true,
        staffProfile: {
          create: {
            fullName: 'Grace Yamasombi (Demo MP Rep)',
            staffIdNumber: 'STAFF-MP-002',
            department: "Bulolo Parliamentary MP's Office",
            positionTitle: 'Executive District Liaison Officer',
            officeLocation: 'Bulolo Electorate Office'
          }
        }
      }
    });

    await prisma.user.upsert({
      where: { accountId: 'BC-USR-2026-0003' },
      update: {},
      create: {
        accountId: 'BC-USR-2026-0003',
        email: 'dist.admin@buloloconnect.gov.pg',
        phoneNumber: '+67570000003',
        passwordHash: adminPasswordHash,
        role: 'DISTRICT_ADMIN',
        preferredLanguage: 'en',
        isVerified: true,
        staffProfile: {
          create: {
            fullName: 'Samson Balo (Demo District Admin)',
            staffIdNumber: 'STAFF-BD-003',
            department: 'Bulolo District Administration',
            positionTitle: 'District Administrator',
            officeLocation: 'Bulolo District Administration'
          }
        }
      }
    });

    await prisma.user.upsert({
      where: { accountId: 'BC-USR-2026-0004' },
      update: {},
      create: {
        accountId: 'BC-USR-2026-0004',
        email: 'staff@buloloconnect.gov.pg',
        phoneNumber: '+67570000004',
        passwordHash: adminPasswordHash,
        role: 'OFFICE_STAFF',
        preferredLanguage: 'tpi',
        isVerified: true,
        staffProfile: {
          create: {
            fullName: 'Ruth Yopisa (Demo Staff)',
            staffIdNumber: 'STAFF-BD-004',
            department: 'Community Development & Citizen Services',
            positionTitle: 'Senior Customer Service & Case Officer',
            officeLocation: 'Bulolo Public Front Desk'
          }
        }
      }
    });

    // 2.3 Sample Citizen User
    const citizenUser = await prisma.user.upsert({
      where: { accountId: 'BC-USR-2026-0100' },
      update: {},
      create: {
        accountId: 'BC-USR-2026-0100',
        email: 'citizen@bulolo.pg',
        phoneNumber: '+67571234567',
        passwordHash: citizenPasswordHash,
        role: 'CITIZEN',
        preferredLanguage: 'en',
        isVerified: true,
        citizenProfile: {
          create: {
            fullName: 'John Somare (Demo Citizen)',
            province: 'Morobe Province',
            district: 'Bulolo District',
            llg: 'Mumeng Rural LLG',
            ward: 'Ward 01 - Sambio',
            village: 'Sambio Village',
            residentialLocation: 'Sambio Bridge Area, Mumeng',
            isDiaspora: false
          }
        }
      },
      include: {
        citizenProfile: true
      }
    });

    console.log('✅ Demo staff and citizen accounts initialized.');

    // 2.4 Sample District Services (Explicitly marked as sample evaluation dataset)
    const servicesData = [
      {
        name: 'Bulolo District Hospital & Emergency Health Centre',
        category: 'HEALTHCARE',
        description: 'Primary referral health facility offering emergency triage, in-patient wards, maternity care, and pharmaceutical dispensary.',
        organisationName: 'Morobe Provincial Health Authority (MPHA)',
        physicalAddress: 'Hospital Road, Bulolo Town',
        llg: 'Bulolo Urban LLG',
        ward: 'Ward 01 - Bulolo Central',
        phoneNumber: '+675 474 5234',
        operatingHours: '24 Hours / 7 Days',
        servicesOffered: JSON.stringify(['Emergency Triage', 'Maternity Ward', 'Outpatient Clinic', 'Pharmacy', 'Pathology Lab']),
        verificationStatus: 'VERIFIED',
        verifiedByOfficerName: 'Evaluation Officer (Demo Record)',
        informationSource: 'Bulolo Connect Developer Evaluation Dataset (Sample)',
        isEmergencyService: true
      },
      {
        name: 'Mumeng Rural Health Centre & Aid Post Network',
        category: 'HEALTHCARE',
        description: 'Comprehensive rural health centre serving the Wau-Bulolo highway corridor, Zenag communities, and outlying aid posts.',
        organisationName: 'MPHA / Lutheran Health Services',
        physicalAddress: 'Mumeng Station Centre',
        llg: 'Mumeng Rural LLG',
        ward: 'Ward 05 - Mumeng Station',
        phoneNumber: '+675 474 5110',
        operatingHours: 'Mon - Fri: 8:00 AM - 4:30 PM (24/7 Maternity Emergency)',
        servicesOffered: JSON.stringify(['Outpatient Care', 'Maternal Child Health (MCH)', 'Immunization', 'Emergency Stabilization']),
        verificationStatus: 'VERIFIED',
        verifiedByOfficerName: 'Evaluation Officer (Demo Record)',
        informationSource: 'Bulolo Connect Developer Evaluation Dataset (Sample)',
        isEmergencyService: true
      },
      {
        name: 'Bulolo Police Station & Rural Command',
        category: 'POLICE_AND_EMERGENCY',
        description: 'Royal Papua New Guinea Constabulary (RPNGC) District Command providing law enforcement, crime prevention, and highway patrol.',
        organisationName: 'Royal Papua New Guinea Constabulary',
        physicalAddress: 'Government Station, Bulolo Town',
        llg: 'Bulolo Urban LLG',
        ward: 'Ward 05 - Commercial Sector',
        phoneNumber: '+675 474 5222',
        operatingHours: '24 Hours / 7 Days',
        servicesOffered: JSON.stringify(['Community Policing', 'Highway Patrol', 'Emergency Response', 'Incident Reporting']),
        verificationStatus: 'VERIFIED',
        verifiedByOfficerName: 'Evaluation Officer (Demo Record)',
        informationSource: 'Bulolo Connect Developer Evaluation Dataset (Sample)',
        isEmergencyService: true
      },
      {
        name: 'Bulolo Technical Secondary School',
        category: 'EDUCATION',
        description: 'Secondary education institution providing Grade 9 to 12 curricula alongside technical and trade vocational certifications.',
        organisationName: 'Department of Education PNG',
        physicalAddress: 'Forestry College Way, Bulolo Town',
        llg: 'Bulolo Urban LLG',
        ward: 'Ward 04 - Forestry College Zone',
        phoneNumber: '+675 474 5301',
        operatingHours: 'Mon - Fri: 7:30 AM - 4:00 PM',
        servicesOffered: JSON.stringify(['Grade 9-12 Education', 'Carpentry & Joinery', 'Automotive Mechanics', 'Computing']),
        verificationStatus: 'VERIFIED',
        verifiedByOfficerName: 'Evaluation Officer (Demo Record)',
        informationSource: 'Bulolo Connect Developer Evaluation Dataset (Sample)',
        isEmergencyService: false
      },
      {
        name: 'District Primary Industry (DPI) & Coffee Extension Centre',
        category: 'AGRICULTURE',
        description: 'Support centre for coffee farmers, poultry growers, and food crop producers. Provides disease advice, high-yield seedlings, and market linkages.',
        organisationName: 'Bulolo District Administration & Coffee Industry Corporation',
        physicalAddress: 'Mumeng Agricultural Station',
        llg: 'Mumeng Rural LLG',
        ward: 'Ward 05 - Mumeng Station',
        phoneNumber: '+675 474 5188',
        operatingHours: 'Mon - Fri: 8:00 AM - 4:06 PM',
        servicesOffered: JSON.stringify(['Coffee Nursery Seedlings', 'Poultry Extension Advisory', 'Pest Management Support', 'Farmer Training']),
        verificationStatus: 'VERIFIED',
        verifiedByOfficerName: 'Evaluation Officer (Demo Record)',
        informationSource: 'Bulolo Connect Developer Evaluation Dataset (Sample)',
        isEmergencyService: false
      }
    ];

    for (const s of servicesData) {
      const existing = await prisma.districtService.findFirst({ where: { name: s.name } });
      if (!existing) {
        await prisma.districtService.create({ data: s });
      }
    }
    console.log('✅ Sample District Services registered.');

    // 2.5 Sample Assistance Programmes (Clearly flagged as demo grants)
    const programmesData = [
      {
        code: 'EDU-SCHOLAR-2026',
        title: '[DEMO] Bulolo Tertiary & Technical School Fee Subsidy 2026',
        category: 'EDUCATIONAL_ASSISTANCE',
        description: '[SAMPLE FOR PLATFORM TESTING] Direct tuition fee subsidy supporting Bulolo students attending recognized universities and colleges.',
        eligibilityCriteria: JSON.stringify([
          'Must be a genuine resident of Bulolo District or registered Bulolo diaspora student',
          'Enrolled at an accredited PNG tertiary institution',
          'Copy of Acceptance Letter and Official Fee Structure required'
        ]),
        requiredDocuments: JSON.stringify([
          'Tertiary Acceptance Letter / Registration Proof',
          'Official Institutional Invoice / Fee Structure',
          'Bulolo Ward Councillor Endorsement Letter',
          'Valid Identification Document'
        ]),
        isOpen: true,
        responsibleOffice: 'Bulolo District Education Sub-Committee (Demo)',
        contactPerson: 'Education Liaison Officer (Demo)',
        contactPhone: '+675 474 5320',
        contactEmail: 'education.demo@buloloconnect.gov.pg',
        maximumGrantAmount: 3500.00
      },
      {
        code: 'AGRI-COFFEE-2026',
        title: '[DEMO] Rural Coffee Farmers Rehabilitation & Equipment Grant',
        category: 'AGRICULTURAL_ASSISTANCE',
        description: '[SAMPLE FOR PLATFORM TESTING] Targeted support for smallholder coffee growers across Mumeng, Watut, and Buang.',
        eligibilityCriteria: JSON.stringify([
          'Registered smallholder farmer with active coffee plot (minimum 200 trees)',
          'Located within Bulolo District',
          'Endorsed by local Ward Councillor'
        ]),
        requiredDocuments: JSON.stringify([
          'Farmer Registration Form',
          'Ward Member Endorsement Letter',
          'Coffee Garden Inspection Slip'
        ]),
        isOpen: true,
        responsibleOffice: 'Bulolo District Agriculture & Livestock Office (Demo)',
        contactPerson: 'District Agricultural Coordinator (Demo)',
        contactPhone: '+675 474 5188',
        contactEmail: 'agriculture.demo@buloloconnect.gov.pg',
        maximumGrantAmount: 2000.00
      },
      {
        code: 'MED-EMERGENCY-2026',
        title: '[DEMO] Emergency Medical Transport & Vulnerable Patient Relief',
        category: 'MEDICAL_ASSISTANCE',
        description: '[SAMPLE FOR PLATFORM TESTING] Financial assistance for emergency medical evacuations to Angau Memorial Hospital (Lae).',
        eligibilityCriteria: JSON.stringify([
          'Referred by medical officer at Bulolo District Hospital or Mumeng Health Centre',
          'Bulolo resident with verified lack of emergency travel funds',
          'Urgent surgical, maternal, or trauma condition'
        ]),
        requiredDocuments: JSON.stringify([
          'Official Medical Referral Letter',
          'Patient Admission / Triage Record',
          'Caregiver Emergency Contact Details'
        ]),
        isOpen: true,
        responsibleOffice: 'District Health & Welfare Unit (Demo)',
        contactPerson: 'Welfare Case Officer (Demo)',
        contactPhone: '+675 474 5234',
        contactEmail: 'health.demo@buloloconnect.gov.pg',
        maximumGrantAmount: 1500.00
      }
    ];

    for (const p of programmesData) {
      await prisma.assistanceProgramme.upsert({
        where: { code: p.code },
        update: {},
        create: p
      });
    }
    console.log('✅ Sample Assistance Programmes registered.');

    // 2.6 Sample Development Projects (Unverified finances, clearly marked as demo)
    const projectsData = [
      {
        projectCode: 'BDP-2026-001',
        title: '[DEMO] Wau-Bulolo Highway Section Resurfacing & Kumalu River Drainage',
        category: 'ROADS_AND_BRIDGES',
        description: '[DEMO RECORD FOR EVALUATION] Comprehensive rehabilitation of flood-prone road sections between Zenag, Kumalu River crossing, and Bulolo Town.',
        llg: 'Mumeng Rural LLG',
        ward: 'Ward 04 - Kumalu',
        specificLocation: 'Kumalu River Bridge & Highway Chainage KM 72-85',
        implementingAgency: 'Department of Works and Highways / Bulolo DDA (Demo)',
        contractorName: 'Morobe Civil Engineering Works (Sample)',
        commencementDate: new Date('2025-08-15'),
        expectedCompletionDate: new Date('2026-12-20'),
        status: 'UNDER_CONSTRUCTION',
        progressPercentage: 65,
        publishedBudgetKina: 4800000.00,
        fundingSource: 'Bulolo District Services Improvement Program (DSIP) 2025/2026 (Demo)',
        isFinanciallyVerified: false, // NOT financially verified (sample data)
        featuredImageUrl: '/images/highway_works.jpg'
      },
      {
        projectCode: 'BDP-2026-002',
        title: '[DEMO] Bulolo Town Gravity Clean Water Reticulation Expansion',
        category: 'WATER_AND_SANITATION',
        description: '[DEMO RECORD FOR EVALUATION] Installation of high-capacity gravity water intake at Mount Susu headwaters, solar chlorination unit, and 4.2km distribution pipes.',
        llg: 'Bulolo Urban LLG',
        ward: 'Ward 03 - Compound & Market Area',
        specificLocation: 'Mount Susu Catchment & Town Central Reservoir',
        implementingAgency: 'Water PNG & Bulolo Urban LLG Council (Demo)',
        contractorName: 'CleanWater PNG Contractors (Sample)',
        commencementDate: new Date('2025-11-01'),
        expectedCompletionDate: new Date('2026-09-30'),
        status: 'UNDER_CONSTRUCTION',
        progressPercentage: 45,
        publishedBudgetKina: 1850000.00,
        fundingSource: 'Morobe Provincial Government Water Infrastructure Grant (Demo)',
        isFinanciallyVerified: false, // NOT financially verified (sample data)
        featuredImageUrl: '/images/water_project.jpg'
      },
      {
        projectCode: 'BDP-2026-003',
        title: '[DEMO] Watut Valley Rural Aid Post Solar Electrification & Vaccine Cold Chain',
        category: 'HEALTHCARE',
        description: '[DEMO RECORD FOR EVALUATION] Off-grid solar power systems installed across remote aid posts in Watut Valley.',
        llg: 'Watut Rural LLG',
        ward: 'Ward 02 - Middle Watut / Maralina',
        specificLocation: 'Maralina, Tsile Tsile, and Dangal Aid Posts',
        implementingAgency: 'Morobe Provincial Health Authority & Bulolo DDA (Demo)',
        contractorName: 'SolarTech Energy Pacific (Sample)',
        commencementDate: new Date('2026-01-10'),
        expectedCompletionDate: new Date('2026-07-15'),
        status: 'UNDER_CONSTRUCTION',
        progressPercentage: 70,
        publishedBudgetKina: 620000.00,
        fundingSource: 'Bulolo District Health Grant (Demo)',
        isFinanciallyVerified: false, // NOT financially verified (sample data)
        featuredImageUrl: '/images/solar_health.jpg'
      }
    ];

    for (const pr of projectsData) {
      await prisma.developmentProject.upsert({
        where: { projectCode: pr.projectCode },
        update: {},
        create: pr
      });
    }
    console.log('✅ Sample Development Projects registered.');

    // 2.7 Sample Announcements (Flagged with [DEMO] prefix)
    const announcementsData = [
      {
        title: '[DEMO] Opening of Applications for Bulolo District Tertiary School Fee Subsidy',
        category: 'EDUCATIONAL_OPPORTUNITY',
        summary: '[DEMO NOTICE FOR TESTING] Bulolo District Development Authority announces sample student assistance application testing.',
        content: `[DEMO DATA - NOT AN OFFICIAL GOVERNMENT ANNOUNCEMENT]\n\nThis is a sample evaluation record for platform testing. Eligible students studying at recognized tertiary institutions can test application workflows through Bulolo Connect.`,
        targetLlg: null,
        isUrgent: false,
        isPublished: true,
        authorStaffName: 'District Education Liaison Desk (Demo)'
      },
      {
        title: '[DEMO] Highway Weather & Kumalu River Crossing Safety Advisory',
        category: 'EMERGENCY_NOTICE',
        summary: '[DEMO NOTICE FOR TESTING] Heavy rainfall in the upper ranges sample advisory for test motorists.',
        content: `[DEMO DATA - NOT AN OFFICIAL DISASTER NOTICE]\n\nThis is a sample emergency notice to test the public safety notification feed on Bulolo Connect.`,
        targetLlg: 'Mumeng Rural LLG',
        isUrgent: false,
        isPublished: true,
        authorStaffName: 'Bulolo District Disaster Desk (Demo)'
      }
    ];

    for (const a of announcementsData) {
      const existing = await prisma.announcement.findFirst({ where: { title: a.title } });
      if (!existing) {
        await prisma.announcement.create({ data: a });
      }
    }
    console.log('✅ Sample Announcements registered.');

    // 2.8 Sample Citizen Request
    await prisma.citizenRequest.upsert({
      where: { referenceNumber: 'REQ-2026-00001' },
      update: {},
      create: {
        referenceNumber: 'REQ-2026-00001',
        citizenProfileId: citizenUser.citizenProfile?.id,
        isAnonymous: false,
        contactName: 'John Somare (Demo)',
        contactPhone: '+67571234567',
        contactEmail: 'citizen@bulolo.pg',
        category: 'ROADS_AND_BRIDGES',
        subject: '[DEMO] Culvert blockage near Sambio Bridge',
        description: '[SAMPLE CITIZEN REPORT FOR TEST SUITE] Following heavy rains, the road drainage culvert approximately 200m before Sambio Bridge has overflowed with gravel and logs.',
        llg: 'Mumeng Rural LLG',
        ward: 'Ward 01 - Sambio',
        village: 'Sambio Village',
        urgency: 'HIGH',
        status: 'ACTION_IN_PROGRESS',
        departmentReferredTo: 'Works and Infrastructure Desk',
        resolutionSummary: 'Inspection team dispatched from Mumeng Station with backhoe.'
      }
    });
    console.log('✅ Sample citizen request created.');
  }

  console.log('✅ Seed process finished successfully.');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });