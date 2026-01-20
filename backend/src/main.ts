import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  app.enableCors({
    origin: [
      'https://agentsport.com.ar', // Versión sin www
      'https://www.agentsport.com.ar', // Versión CON www (la que te dio error)
      'http://localhost:5173', // Tu entorno local
      'http://127.0.0.1:5173', // Tu entorno local (IP explícita)
      process.env.FRONTEND_URL, // El de la variable de entorno (por seguridad)
      process.env.FRONTEND_URL,
    ].filter((origin): origin is string => !!origin),
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Server running on http://localhost:${port}`);
}
bootstrap();
