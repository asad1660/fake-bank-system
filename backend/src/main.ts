import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const allowedOrigins =
    process.env.CORS_ORIGINS?.split(',').map(o => o.trim()) ?? [];

  app.enableCors({
    origin: (origin, callback) => {
      // Allow non-browser clients (Postman, curl, server-to-server)
      if (!origin) {
        return callback(null, true);
      }

      // Allow configured origins
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      // Reject silently (do NOT throw)
      return callback(null, false);
    },
    credentials: true,
  });

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
