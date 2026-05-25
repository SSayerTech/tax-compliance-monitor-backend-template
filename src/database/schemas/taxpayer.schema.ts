// src/database/schemas/taxpayer.schema.ts
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';
import type {
  TaxType,
  ComplianceStatus,
  RiskTrend,
  RiskEventType,
} from '../../types/common';

@Schema({ _id: false })
export class TaxpayerInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ required: true, type: [String], enum: ['VAT', 'INCOME_TAX'] })
  taxTypes: TaxType[];
}

@Schema({ _id: false })
export class TaxTypeRisk {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  exposure: number;

  @Prop({ required: true })
  lastFiled: string;

  @Prop({ required: true })
  nextDue: string;

  @Prop({ required: true, enum: ['COMPLIANT', 'LATE', 'MISSING'] })
  status: ComplianceStatus;
}

@Schema({ _id: false })
export class RiskScore {
  @Prop({ required: true })
  score: number;

  @Prop()
  previousScore: number;

  @Prop({ required: true, enum: ['up', 'down', 'stable'] })
  trend: RiskTrend;

  @Prop({ required: true })
  exposure: number;
}

@Schema({ _id: false })
export class RiskComponents {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  vat: TaxTypeRisk;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  incomeTax: TaxTypeRisk;
}

@Schema({ _id: false })
export class RiskProfile {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  overall: RiskScore;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  components: RiskComponents;
}

@Schema({ _id: false })
export class RiskEvent {
  @Prop({
    required: true,
    enum: ['LATE_FILING', 'MISSING_DECLARATION', 'RISK_INCREASE'],
  })
  type: RiskEventType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  exposure: number;
}

@Schema({ _id: false })
export class HistoricalRiskData {
  @Prop({ required: true })
  period: string;

  @Prop({ required: true })
  overallScore: number;

  @Prop({ required: true })
  vatScore: number;

  @Prop({ required: true })
  incomeTaxScore: number;

  @Prop({ required: true })
  totalExposure: number;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }] })
  events?: RiskEvent[];
}

@Schema()
export class Taxpayer {
  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  taxpayer: TaxpayerInfo;

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  riskProfile: RiskProfile;

  @Prop({ type: [{ type: MongooseSchema.Types.Mixed }], required: true })
  history: HistoricalRiskData[];
}

export const TaxpayerSchema = SchemaFactory.createForClass(Taxpayer);
export type TaxpayerDocument = HydratedDocument<Taxpayer>;
