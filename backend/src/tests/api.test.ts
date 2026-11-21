import { createApp } from '../app';
import http from 'http';

async function runTests() {
  console.log('🧪 Starting Bulolo Connect API Test Suite...');
  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(5099, '127.0.0.1', resolve));
  const baseUrl = 'http://127.0.0.1:5099';

  let passCount = 0;
  let failCount = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`  ✅ PASS: ${name}`);
      passCount++;
    } catch (err: any) {
      console.error(`  ❌ FAIL: ${name} ->`, err.message || err);
      failCount++;
    }
  }

  try {
    // 1. Health check
    await test('Health check endpoint', async () => {
      const res = await fetch(`${baseUrl}/api/health`);
      if (res.status !== 200) throw new Error(`Status ${res.status}`);
      const data = (await res.json()) as any;
      if (data.status !== 'UP') throw new Error('Status not UP');
    });

    // 2. Verified LLGs
    await test('Get Bulolo LLGs directory', async () => {
      const res = await fetch(`${baseUrl}/api/v1/communities/llgs`);
      const data = (await res.json()) as any;
      if (!data.success || data.llgs.length !== 4) throw new Error(`Expected 4 LLGs, got ${data.llgs?.length}`);
      const names = data.llgs.map((l: any) => l.name);
      if (!names.includes('Mumeng Rural LLG') || !names.includes('Watut Rural LLG')) {
        throw new Error('Missing Mumeng or Watut');
      }
    });

    // 3. District Services
    await test('Get verified district services', async () => {
      const res = await fetch(`${baseUrl}/api/v1/services`);
      const data = (await res.json()) as any;
      if (!data.success || data.count === 0) throw new Error('No services returned');
    });

    // 4. Assistance Programmes
    await test('Get assistance programmes', async () => {
      const res = await fetch(`${baseUrl}/api/v1/assistance/programmes`);
      const data = (await res.json()) as any;
      if (!data.success || data.programmes.length === 0) throw new Error('No programmes found');
    });

    // 5. Development Projects
    await test('Get development projects', async () => {
      const res = await fetch(`${baseUrl}/api/v1/projects`);
      const data = (await res.json()) as any;
      if (!data.success || data.projects.length === 0) throw new Error('No projects found');
    });

    // 6. Track Request
    await test('Track request REQ-2026-00001', async () => {
      const res = await fetch(`${baseUrl}/api/v1/requests/track/REQ-2026-00001`);
      const data = (await res.json()) as any;
      if (!data.success || data.tracking.referenceNumber !== 'REQ-2026-00001') {
        throw new Error('Failed to track reference REQ-2026-00001');
      }
    });

    // 7. Citizen Login
    let citizenToken = '';
    await test('Citizen login (John Somare)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'citizen@bulolo.pg',
          password: 'BuloloCitizen2026!'
        })
      });
      const data = (await res.json()) as any;
      if (!data.success || !data.token) throw new Error('Citizen login failed');
      citizenToken = data.token;
    });

    // 8. Admin Login
    let adminToken = '';
    await test('Admin login (Super Admin)', async () => {
      const res = await fetch(`${baseUrl}/api/v1/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: 'admin@buloloconnect.gov.pg',
          password: 'BuloloAdmin2026!'
        })
      });
      const data = (await res.json()) as any;
      if (!data.success || !data.token) throw new Error('Admin login failed');
      adminToken = data.token;
    });

    // 9. Submit Citizen Request
    let newReqRef = '';
    await test('Submit new citizen request', async () => {
      const res = await fetch(`${baseUrl}/api/v1/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${citizenToken}`
        },
        body: JSON.stringify({
          category: 'WATER_SUPPLY',
          subject: 'Village water tank filtration pipe ruptured',
          description: 'The community gravity water pipe supplying Zenag village sub-cluster has developed a major leak near the school gate.',
          llg: 'Mumeng Rural LLG',
          ward: 'Ward 02 - Zenag',
          village: 'Zenag Village',
          urgency: 'HIGH',
          isAnonymous: false
        })
      });
      const data = (await res.json()) as any;
      if (!data.success || !data.referenceNumber) throw new Error('Failed to submit citizen request');
      newReqRef = data.referenceNumber;
    });

    // 10. Admin Overview & Metrics
    await test('Admin dashboard overview metrics calculation', async () => {
      const res = await fetch(`${baseUrl}/api/v1/reports/overview`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      const data = (await res.json()) as any;
      if (!data.success || !data.metrics) throw new Error('Failed to fetch admin metrics');
      if (data.metrics.totalRequests < 2) throw new Error('Expected at least 2 requests in actual database');
    });

    // 11. CSV Export
    await test('Export citizen requests to CSV', async () => {
      const res = await fetch(`${baseUrl}/api/v1/reports/export?type=requests&format=csv`, {
        headers: { 'Authorization': `Bearer ${adminToken}` }
      });
      if (res.status !== 200) throw new Error('Failed CSV export');
      const csv = await res.text();
      if (!csv.includes('ReferenceNumber,Category') || !csv.includes(newReqRef)) {
        throw new Error('CSV missing reference or headers');
      }
    });

    console.log(`\n=======================================================`);
    console.log(`🏁 Test Results: ${passCount} Passed, ${failCount} Failed.`);
    console.log(`=======================================================`);

    if (failCount > 0) {
      process.exit(1);
    }
  } finally {
    server.close();
  }
}

runTests();
