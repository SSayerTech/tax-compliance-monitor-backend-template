import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema({ _id: false })
export class TaxpayerInfo {
  @Prop({ required: true })
  id: string;

  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  taxTypes: string[];
}

@Schema({ _id: false })
export class RiskScore {
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  previousScore: number;

  @Prop({ required: true })
  trend: string; // 'up' | 'down' | 'stable'

  @Prop({ type: Number, required: true })
  exposure: number;
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

  @Prop({ required: true })
  status: string; // 'COMPLIANT' | 'NON_COMPLIANT'
}

@Schema({ _id: false })
export class RiskComponents {
  @Prop({ type: TaxTypeRisk, required: true })
  vat: TaxTypeRisk;

  @Prop({ type: TaxTypeRisk, required: true })
  incomeTax: TaxTypeRisk;
}

@Schema({ _id: false })
export class RiskProfile {
  @Prop({ type: RiskScore, required: true })
  overall: RiskScore;

  @Prop({ type: RiskComponents, required: true })
  components: RiskComponents;
}

@Schema({ _id: false })
export class RiskEvent {
  @Prop({ required: true })
  type: string; // 'RISK_INCREASE' | 'LATE_FILING' | etc.

  @Prop({ required: true })
  description: string;

  @Prop({ type: Number, required: true })
  exposure: number;
}

@Schema({ _id: false })
export class HistoricalRiskData {
  @Prop({ required: true })
  period: string; // e.g., '2024-11'

  @Prop({ required: true })
  overallScore: number;

  @Prop({ required: true })
  vatScore: number;

  @Prop({ required: true })
  incomeTaxScore: number;

  @Prop({ required: true })
  totalExposure: number;

  @Prop({ type: [RiskEvent], required: true })
  events: RiskEvent[];
}

@Schema()
export class Taxpayer {
  @Prop({ type: TaxpayerInfo, required: true })
  taxpayer: TaxpayerInfo;

  @Prop({ type: RiskProfile, required: true })
  riskProfile: RiskProfile;

  @Prop({ type: [HistoricalRiskData], required: true })
  history: HistoricalRiskData[];
}

export const TaxpayerSchema = SchemaFactory.createForClass(Taxpayer);
export type TaxpayerDocument = HydratedDocument<Taxpayer>;
