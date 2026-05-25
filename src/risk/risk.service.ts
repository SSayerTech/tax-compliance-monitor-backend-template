// src/risk/risk.service.ts
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Taxpayer } from '../database/schemas/taxpayer.schema';
import type { TaxpayerRiskData } from '../types/risk';
import type { TaxpayerInfo } from '../types/taxpayer';

@Injectable()
export class RiskService {
  constructor(
    @InjectModel(Taxpayer.name) private taxpayerModel: Model<Taxpayer>,
  ) {}

  async getTaxpayerRisk(taxpayerId: string): Promise<TaxpayerRiskData | null> {
    const taxpayer = await this.taxpayerModel
      .findOne({ 'taxpayer.id': taxpayerId }, { __v: 0, _id: 0 })
      .lean();
    return taxpayer as TaxpayerRiskData;
  }

  async getRiskHistory(
    taxpayerId: string,
  ): Promise<TaxpayerRiskData['history'] | null> {
    const taxpayer = await this.taxpayerModel
      .findOne({ 'taxpayer.id': taxpayerId }, { history: 1, _id: 0 })
      .lean();
    return taxpayer?.history || null;
  }

  async getAllTaxpayers(): Promise<TaxpayerInfo[]> {
    const taxpayers = await this.taxpayerModel
      .find({}, { taxpayer: 1, _id: 0 })
      .lean();
    return taxpayers
      .map((doc) => doc.taxpayer)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  async taxpayerExists(taxpayerId: string): Promise<boolean> {
    const count = await this.taxpayerModel
      .countDocuments({ 'taxpayer.id': taxpayerId })
      .exec();
    return count > 0;
  }
}
