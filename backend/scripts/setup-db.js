const { execSync } = require('child_process');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const dbUrl = process.env.DATABASE_URL || '';

const isPostgres =
  dbUrl.startsWith('postgresql://') ||
  dbUrl.startsWith('postgres://');

if (!dbUrl) {
  console.error('ERROR: DATABASE_URL is not configured.');
  process.exit(1);
}

const schemaFile = isPostgres
  ? 'prisma/schema.prisma'
  : 'prisma/schema.sqlite.prisma';

console.log(`Target database: ${isPostgres ? 'PostgreSQL' : 'SQLite'}`);
console.log(`Using schema: ${schemaFile}`);

try {
  execSync(
    `npx prisma db push --schema=${schemaFile} --skip-generate`,
    { stdio: 'inherit' }
  );

  execSync(
    `npx prisma generate --schema=${schemaFile}`,
    { stdio: 'inherit' }
  );

  console.log('Database setup completed successfully. No seed was executed.');
} catch (error) {
  console.error('Database setup failed:', error.message);
  process.exit(1);
}
