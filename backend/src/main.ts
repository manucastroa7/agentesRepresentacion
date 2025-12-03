import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  app.enableCors({
    // Permitimos localhost (para tus pruebas) Y cualquier otro origen (*) por ahora
    // Cuando tengas el dominio de Hostinger, cambiarás el '*' por 'https://agentsport.com'
    origin: ['http://localhost:5173', '*'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // Esto está perfecto, Railway inyectará su propio PORT
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
