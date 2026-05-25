import * as Joi from 'joi';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from './database/database.module';
import { InvoicesModule } from './invoices/invoices.module';
import { RiskModule } from './risk/risk.module';
import { MonitoringModule } from './monitoring/monitoring.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        MONGODB_DB_NAME: Joi.string().required(),
        PORT: Joi.number().default(3001),
        FRONTEND_URL: Joi.string().default('http://localhost:3000'),
        DB_READ_ONLY: Joi.string().valid('true', 'false').default('false'),
      }),
    }),
    DatabaseModule,
    ScheduleModule.forRoot(),
    RiskModule,
    InvoicesModule,
    MonitoringModule,
  ],
})
export class AppModule {}
