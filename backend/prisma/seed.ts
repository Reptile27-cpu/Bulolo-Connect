import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Bulolo Connect Database Seed...');

  // 1. Setup Password Hashes
  const adminPasswordHash = await bcrypt.hash('BuloloAdmin2026!', 12);
  const citizenPasswordHash = await bcrypt.hash('BuloloCitizen2026!', 12);

  // 2. Create District & LLGs
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

  const mumengLLG = await prisma.lLG.upsert({
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

  const watutLLG = await prisma.lLG.upsert({
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

  const buangLLG = await prisma.lLG.upsert({
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

  const buloloUrbanLLG = await prisma.lLG.upsert({
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

  console.log('✅ LLGs created: Mumeng, Watut, Buang, Bulolo Urban.');

  // 3. Create Sample Administrative Staff Users
  const superAdmin = await prisma.user.upsert({
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
          fullName: 'Kila Vele (Super Administrator)',
          staffIdNumber: 'STAFF-BD-001',
          department: 'District ICT & Systems Governance',
          positionTitle: 'Chief Systems Administrator',
          officeLocation: 'Bulolo District Administration Civic Centre'
        }
      }
    }
  });

  const mpOfficeRep = await prisma.user.upsert({
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
          fullName: 'Grace Yamasombi',
          staffIdNumber: 'STAFF-MP-002',
          department: "Bulolo Parliamentary MP's Office",
          positionTitle: 'Executive District Liaison Officer',
          officeLocation: 'Bulolo Electorate Office'
        }
      }
    }
  });

  const districtAdmin = await prisma.user.upsert({
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
          fullName: 'Samson Balo',
          staffIdNumber: 'STAFF-BD-003',
          department: 'Bulolo District Administration',
          positionTitle: 'District Administrator',
          officeLocation: 'Bulolo District Administration'
        }
      }
    }
  });

  const officeStaff = await prisma.user.upsert({
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
          fullName: 'Ruth Yopisa',
          staffIdNumber: 'STAFF-BD-004',
          department: 'Community Development & Citizen Services',
          positionTitle: 'Senior Customer Service & Case Officer',
          officeLocation: 'Bulolo Public Front Desk'
        }
      }
    }
  });

  // 4. Create Sample Verified Citizen
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
          fullName: 'John Somare',
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

  console.log('✅ Staff & Citizen test accounts created.');

  // 5. Create Verified District Services
  const servicesData = [
    {
      name: 'Bulolo District Hospital & Emergency Health Centre',
      category: 'HEALTHCARE',
      description: 'The primary referral health facility in Bulolo District offering 24-hour emergency triage, in-patient wards, maternity care, and pharmaceutical dispensary.',
      organisationName: 'Morobe Provincial Health Authority (MPHA)',
      physicalAddress: 'Hospital Road, Bulolo Town',
      llg: 'Bulolo Urban LLG',
      ward: 'Ward 01 - Bulolo Central',
      phoneNumber: '+675 474 5234',
      operatingHours: '24 Hours / 7 Days',
      servicesOffered: JSON.stringify(['Emergency Triage', 'Maternity Ward', 'Outpatient Clinic', 'Pharmacy', 'Pathology Lab']),
      verificationStatus: 'VERIFIED',
      verifiedByOfficerName: 'District Health Inspector',
      informationSource: 'Morobe Provincial Health Authority Directory 2026',
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
      verifiedByOfficerName: 'District Health Inspector',
      informationSource: 'District Health Board Verification 2026',
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
      verifiedByOfficerName: 'Station Commander',
      informationSource: 'RPNGC Morobe Division 2026',
      isEmergencyService: true
    },
    {
      name: 'Bulolo Technical Secondary School',
      category: 'EDUCATION',
      description: 'Leading secondary education institution providing Grade 9 to 12 curricula alongside technical and trade vocational certifications.',
      organisationName: 'Department of Education PNG',
      physicalAddress: 'Forestry College Way, Bulolo Town',
      llg: 'Bulolo Urban LLG',
      ward: 'Ward 04 - Forestry College Zone',
      phoneNumber: '+675 474 5301',
      operatingHours: 'Mon - Fri: 7:30 AM - 4:00 PM',
      servicesOffered: JSON.stringify(['Grade 9-12 Education', 'Carpentry & Joinery', 'Automotive Mechanics', 'Computing']),
      verificationStatus: 'VERIFIED',
      verifiedByOfficerName: 'District Education Officer',
      informationSource: 'Morobe Provincial Education Board 2026',
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
      verifiedByOfficerName: 'District Agricultural Officer',
      informationSource: 'CIC & Bulolo DPI 2026',
      isEmergencyService: false
    }
  ];

  for (const s of servicesData) {
    const existing = await prisma.districtService.findFirst({ where: { name: s.name } });
    if (!existing) {
      await prisma.districtService.create({ data: s });
    }
  }

  console.log('✅ Verified District Services registered.');

  // 6. Create Assistance Programmes
  const programmesData = [
    {
      code: 'EDU-SCHOLAR-2026',
      title: 'Bulolo Tertiary & Technical School Fee Subsidy 2026',
      category: 'EDUCATIONAL_ASSISTANCE',
      description: 'Direct tuition fee subsidy supporting Bulolo students attending recognized universities, nursing colleges, teachers colleges, and technical institutes across Papua New Guinea.',
      eligibilityCriteria: JSON.stringify([
        'Must be a genuine resident of Bulolo District or registered Bulolo diaspora student',
        'Enrolled at an accredited PNG tertiary institution (UPNG, Unitech, UOG, PAU, DWU, or recognized colleges)',
        'Copy of current Acceptance Letter / Student ID and Official Fee Structure required',
        'Demonstrated academic merit and community commitment'
      ]),
      requiredDocuments: JSON.stringify([
        'Tertiary Acceptance Letter / Registration Proof',
        'Official Institutional Invoice / Fee Structure',
        'Bulolo Ward Councillor Endorsement Letter',
        'Valid Identification Document'
      ]),
      isOpen: true,
      responsibleOffice: 'Bulolo District Education Sub-Committee',
      contactPerson: 'Education Liaison Officer',
      contactPhone: '+675 474 5320',
      contactEmail: 'education@buloloconnect.gov.pg',
      maximumGrantAmount: 3500.00
    },
    {
      code: 'AGRI-COFFEE-2026',
      title: 'Rural Coffee Farmers Rehabilitation & Equipment Grant',
      category: 'AGRICULTURAL_ASSISTANCE',
      description: 'Targeted support for smallholder coffee growers across Mumeng, Watut, and Buang to acquire hand pulpers, pruning tools, and certified disease-resistant coffee seedlings.',
      eligibilityCriteria: JSON.stringify([
        'Registered smallholder farmer with active coffee plot (minimum 200 trees)',
        'Located within Bulolo District (Mumeng, Watut, Buang, or Bulolo Urban)',
        'Endorsed by local Ward Councillor or Community Cooperative Leader'
      ]),
      requiredDocuments: JSON.stringify([
        'Farmer Registration Form',
        'Ward Member Endorsement Letter',
        'Coffee Garden Inspection Slip (from DPI Officer)'
      ]),
      isOpen: true,
      responsibleOffice: 'Bulolo District Agriculture & Livestock Office',
      contactPerson: 'District Agricultural Coordinator',
      contactPhone: '+675 474 5188',
      contactEmail: 'agriculture@buloloconnect.gov.pg',
      maximumGrantAmount: 2000.00
    },
    {
      code: 'MED-EMERGENCY-2026',
      title: 'Emergency Medical Transport & Vulnerable Patient Relief',
      category: 'MEDICAL_ASSISTANCE',
      description: 'Urgent financial assistance for emergency medical evacuations to Angau Memorial Hospital (Lae) for life-threatening conditions and specialized surgical care.',
      eligibilityCriteria: JSON.stringify([
        'Referred by medical officer at Bulolo District Hospital or Mumeng Health Centre',
        'Bulolo resident with verified lack of emergency travel funds',
        'Urgent surgical, maternal, or trauma condition'
      ]),
      requiredDocuments: JSON.stringify([
        'Official Medical Referral Letter from District Medical Officer',
        'Patient Admission / Triage Record',
        'Caregiver Emergency Contact Details'
      ]),
      isOpen: true,
      responsibleOffice: 'District Health & Welfare Unit',
      contactPerson: 'Welfare Case Officer',
      contactPhone: '+675 474 5234',
      contactEmail: 'health@buloloconnect.gov.pg',
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

  console.log('✅ Assistance Programmes registered.');

  // 7. Create Verified Development Projects
  const projectsData = [
    {
      projectCode: 'BDP-2026-001',
      title: 'Wau-Bulolo Highway Section Resurfacing & Kumalu River Drainage',
      category: 'ROADS_AND_BRIDGES',
      description: 'Comprehensive rehabilitation of flood-prone road sections between Zenag, Kumalu River crossing, and Bulolo Town, including elevated culverts and river training gabion baskets.',
      llg: 'Mumeng Rural LLG',
      ward: 'Ward 04 - Kumalu',
      specificLocation: 'Kumalu River Bridge & Highway Chainage KM 72-85',
      implementingAgency: 'Department of Works and Highways / Bulolo DDA',
      contractorName: 'Morobe Civil Engineering Works',
      commencementDate: new Date('2025-08-15'),
      expectedCompletionDate: new Date('2026-12-20'),
      status: 'UNDER_CONSTRUCTION',
      progressPercentage: 65,
      publishedBudgetKina: 4800000.00,
      fundingSource: 'Bulolo District Services Improvement Program (DSIP) 2025/2026',
      isFinanciallyVerified: true,
      featuredImageUrl: '/images/highway_works.jpg'
    },
    {
      projectCode: 'BDP-2026-002',
      title: 'Bulolo Town Gravity Clean Water Reticulation Expansion',
      category: 'WATER_AND_SANITATION',
      description: 'Installation of high-capacity gravity water intake at Mount Susu headwaters, solar chlorination unit, and 4.2km distribution pipes supplying compound wards and market stalls.',
      llg: 'Bulolo Urban LLG',
      ward: 'Ward 03 - Compound & Market Area',
      specificLocation: 'Mount Susu Catchment & Town Central Reservoir',
      implementingAgency: 'Water PNG & Bulolo Urban LLG Council',
      contractorName: 'CleanWater PNG Contractors',
      commencementDate: new Date('2025-11-01'),
      expectedCompletionDate: new Date('2026-09-30'),
      status: 'UNDER_CONSTRUCTION',
      progressPercentage: 45,
      publishedBudgetKina: 1850000.00,
      fundingSource: 'Morobe Provincial Government Water Infrastructure Grant',
      isFinanciallyVerified: true,
      featuredImageUrl: '/images/water_project.jpg'
    },
    {
      projectCode: 'BDP-2026-003',
      title: 'Watut Valley Rural Aid Post Solar Electrification & Vaccine Cold Chain',
      category: 'HEALTHCARE',
      description: 'Off-grid solar power systems installed across 4 remote aid posts in Watut Valley ensuring reliable nighttime maternity lighting and 24/7 vaccine refrigeration.',
      llg: 'Watut Rural LLG',
      ward: 'Ward 02 - Middle Watut / Maralina',
      specificLocation: 'Maralina, Tsile Tsile, and Dangal Aid Posts',
      implementingAgency: 'Morobe Provincial Health Authority & Bulolo DDA',
      contractorName: 'SolarTech Energy Pacific',
      commencementDate: new Date('2026-01-10'),
      expectedCompletionDate: new Date('2026-07-15'),
      status: 'UNDER_CONSTRUCTION',
      progressPercentage: 70,
      publishedBudgetKina: 620000.00,
      fundingSource: 'Bulolo District Health Grant',
      isFinanciallyVerified: true,
      featuredImageUrl: '/images/solar_health.jpg'
    }
  ];

  for (const pr of projectsData) {
    const existing = await prisma.developmentProject.findUnique({ where: { projectCode: pr.projectCode } });
    if (!existing) {
      await prisma.developmentProject.create({ data: pr });
    }
  }

  console.log('✅ Development Projects seeded.');

  // 8. Create Official District Announcements
  const announcementsData = [
    {
      title: 'Opening of Applications for 2026 Bulolo District Tertiary School Fee Subsidy',
      category: 'EDUCATIONAL_OPPORTUNITY',
      summary: 'Bulolo District Development Authority announces the commencement of student assistance applications for the 2026 academic year.',
      content: `The Bulolo District Development Authority (DDA), in partnership with the MP's Office, invites all eligible students from Mumeng, Watut, Buang, and Bulolo Urban studying at recognized tertiary institutions to submit their applications through Bulolo Connect.\n\nApplications open immediately and will close on March 31, 2026. Please ensure all required documents including institution acceptance letters and ward endorsements are attached.`,
      targetLlg: null,
      isUrgent: true,
      isPublished: true,
      authorStaffName: 'District Education Liaison Desk'
    },
    {
      title: 'Highway Weather & Kumalu River Crossing Safety Advisory',
      category: 'EMERGENCY_NOTICE',
      summary: 'Heavy rainfall in the upper ranges has caused elevated water levels at Kumalu River crossing. Motorists advised to exercise caution.',
      content: `The Morobe Works Department and Bulolo Police Highway Patrol notify all truck drivers and PMV operators travelling between Lae and Bulolo that heavy rains have caused temporary gravel displacement at Kumalu.\n\nGraders are on standby at Mumeng Station. Exercise caution and do not attempt to cross during peak flash flood moments.`,
      targetLlg: 'Mumeng Rural LLG',
      isUrgent: true,
      isPublished: true,
      authorStaffName: 'Bulolo District Disaster & Emergency Desk'
    }
  ];

  for (const a of announcementsData) {
    const existing = await prisma.announcement.findFirst({ where: { title: a.title } });
    if (!existing) {
      await prisma.announcement.create({ data: a });
    }
  }

  // 9. Create a Sample Citizen Request
  const sampleRequest = await prisma.citizenRequest.upsert({
    where: { referenceNumber: 'REQ-2026-00001' },
    update: {},
    create: {
      referenceNumber: 'REQ-2026-00001',
      citizenProfileId: citizenUser.citizenProfile?.id,
      isAnonymous: false,
      contactName: 'John Somare',
      contactPhone: '+67571234567',
      contactEmail: 'citizen@bulolo.pg',
      category: 'ROADS_AND_BRIDGES',
      subject: 'Culvert blockage and minor landslide near Sambio Bridge',
      description: 'Following heavy rains last night, the road drainage culvert approximately 200m before Sambio Bridge has overflowed with gravel and logs, threatening to wash out the outer road edge.',
      llg: 'Mumeng Rural LLG',
      ward: 'Ward 01 - Sambio',
      village: 'Sambio Village',
      urgency: 'HIGH',
      status: 'ACTION_IN_PROGRESS',
      departmentReferredTo: 'Works and Infrastructure Desk',
      resolutionSummary: 'Inspection team dispatched from Mumeng Station with backhoe.'
    }
  });

  console.log('✅ Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
