import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MonitoringConfigDocument = HydratedDocument<MonitoringConfig>;

@Schema({ collection: 'monitoring_configs', timestamps: false })
export class MonitoringConfig {}

export const MonitoringConfigSchema =
  SchemaFactory.createForClass(MonitoringConfig);
