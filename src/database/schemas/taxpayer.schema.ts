// src/database/schemas/taxpayer.schema.ts
// Left some imports for the base structure
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
// TODO: Add other mongoose and types imports
import * as CommonTypes from '../../types/common'
import { TaxpayerInfo as TaxpayerInterface } from 'src/types/taxpayer';
import * as RiskInterface from 'src/types/risk';

@Schema({ _id: false })
export class TaxpayerInfo implements TaxpayerInterface{
  // TODO: Add properties
  @Prop({ required: true })
  id: string;
  
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  taxTypes: CommonTypes.TaxType[];
}

@Schema({ _id: false })
export class TaxTypeRisk implements RiskInterface.TaxTypeRisk{
  // TODO: Add properties
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  exposure: number;
  
  @Prop({ required: true })
  lastFiled: string;

  @Prop({ required: true })
  nextDue: string;

  @Prop({ required: true })
  status: CommonTypes.ComplianceStatus;
}

@Schema({ _id: false })
export class RiskScore implements RiskInterface.RiskScore{
  // TODO: Add properties
  @Prop({ required: true })
  score: number;

  @Prop({ required: true })
  previousScore?: number;

  @Prop({ required: true })
  trend: CommonTypes.RiskTrend;

  @Prop({ required: true })
  exposure: number;
}

@Schema({ _id: false })
export class RiskComponents{
  // TODO: Add properties
  @Prop({ required: true})
  vat: TaxTypeRisk; 
  @Prop({ required: true})
  incomeTax: TaxTypeRisk; 
}

@Schema({ _id: false })
export class RiskProfile implements RiskInterface.RiskProfile{
  // TODO: Add properties
  @Prop({ required: true })
  overall: RiskScore;

  @Prop({ required: true })
  components: RiskComponents
}

@Schema({ _id: false })
export class RiskEvent implements RiskInterface.RiskEvent {
  // TODO: Add properties
  @Prop({ required: true })
  type: CommonTypes.RiskEventType;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  exposure: number;
}

@Schema({ _id: false })
export class HistoricalRiskData implements RiskInterface.HistoricalRiskData{
  // TODO: Add properties
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

  @Prop({})
  events?: RiskEvent[];
}

@Schema()
export class Taxpayer {

  @Prop({ type: TaxpayerInfo, required: true })  // Relación con el subdocumento TaxpayerInfo
  taxpayerInfo: TaxpayerInfo;

  @Prop({ type: RiskProfile, required: true })  // Relación con el subdocumento RiskProfile
  riskProfile: RiskProfile;

  @Prop({ type: [HistoricalRiskData], required: false })
  history?: HistoricalRiskData[];  
}

export const TaxpayerSchema = SchemaFactory.createForClass(Taxpayer);
export type TaxpayerDocument = HydratedDocument<Taxpayer>;
