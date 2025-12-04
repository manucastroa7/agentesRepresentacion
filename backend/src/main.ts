import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: [
      'https://agentsport.com.ar', // Versión sin www
      'https://www.agentsport.com.ar', // Versión CON www (la que te dio error)
      'http://localhost:5173', // Tu entorno local
      process.env.FRONTEND_URL, // El de la variable de entorno (por seguridad)
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
