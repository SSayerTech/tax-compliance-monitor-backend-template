import { Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({ collection: 'invoices', timestamps: false })
export class Invoice {}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);
