import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    // Permitimos el dominio de producción (desde variable) Y localhost para desarrollo
    origin: [
      process.env.FRONTEND_URL, // Esto leerá 'https://agentsport.com.ar'
      'http://localhost:5173'   // Esto es para cuando trabajas en tu PC
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();