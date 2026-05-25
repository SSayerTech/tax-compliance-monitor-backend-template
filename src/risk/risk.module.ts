// src/risk/risk.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { RiskController } from './risk.controller';
import { RiskService } from './risk.service';
import { Taxpayer, TaxpayerSchema } from '../database/schemas/taxpayer.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Taxpayer.name, schema: TaxpayerSchema },
    ]),
  ],
  controllers: [RiskController],
  providers: [RiskService],
  exports: [RiskService],
})
export class RiskModule {}
