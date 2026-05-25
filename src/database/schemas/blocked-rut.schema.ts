import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type BlockedRutDocument = HydratedDocument<BlockedRut>;

@Schema({ collection: 'blocked_ruts', timestamps: false })
export class BlockedRut {}

export const BlockedRutSchema = SchemaFactory.createForClass(BlockedRut);
