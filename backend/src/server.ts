import { createApp } from './app';
import { config } from './config';
import { prisma } from './config/database';

async function bootstrap() {
  const app = createApp();

  try {
    await prisma.$connect();
    console.log('✅ Connected to database successfully.');

    app.listen(config.port, () => {
      console.log(`=======================================================`);
      console.log(`🌿 BULOLO CONNECT REST API Server`);
      console.log(`📍 Bulolo District, Morobe Province, Papua New Guinea`);
      console.log(`🚀 Server running on port ${config.port} (${config.nodeEnv})`);
      console.log(`📡 Health Check: http://localhost:${config.port}/api/health`);
      console.log(`📡 API Base URL: http://localhost:${config.port}/api/v1`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('❌ Failed to start Bulolo Connect backend:', error);
    process.exit(1);
  }
}

bootstrap();
