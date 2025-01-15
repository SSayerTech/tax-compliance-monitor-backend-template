import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Taxpayer, TaxpayerDocument } from '../database/schemas/taxpayer.schema';
import { HistoricalRiskData } from '../database/schemas/taxpayer.schema'; // IMPORTAR EL TIPO

@Injectable()
export class RiskService {
  constructor(
    @InjectModel(Taxpayer.name) private taxpayerModel: Model<TaxpayerDocument>,
  ) {}

  async getAllTaxpayers(): Promise<Taxpayer[]> {
    return this.taxpayerModel.find({}, 'taxpayer').exec();
  }

  async getTaxpayerRisk(taxpayerId: string): Promise<Taxpayer | null> {
    return this.taxpayerModel.findOne({ 'taxpayer.id': taxpayerId }).exec();
  }

  async getRiskHistory(taxpayerId: string): Promise<HistoricalRiskData[] | null> {
    const taxpayer = await this.taxpayerModel.findOne({ 'taxpayer.id': taxpayerId }, 'history').exec();
    return taxpayer?.history || null;
  }
}
