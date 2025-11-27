import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';
import { validationSchema } from './config/validation';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { AgentsModule } from './modules/agents/agents.module';
import { PlayersModule } from './modules/players/players.module';
import { MediaModule } from './modules/media/media.module';
import { DomainsModule } from './modules/domains/domains.module';
import { DemoRequestsModule } from './modules/demo-requests/demo-requests.module';
import { SuperadminModule } from './modules/superadmin/superadmin.module';
import { PublicModule } from './modules/public/public.module';
import { MailModule } from './modules/mail/mail.module';

import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { GlobalExceptionFilter } from './common/exceptions/global-exception.filter';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';

import { SeedingService } from './modules/database/seeding.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
      validationSchema,
    }),
    DatabaseModule,
    UsersModule,
    AuthModule,
    AgentsModule,
    PlayersModule,
    MediaModule,
    DomainsModule,
    DemoRequestsModule,
    SuperadminModule,
    PublicModule,
    MailModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    SeedingService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule { }
