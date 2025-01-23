// src/risk/risk.service.ts
import { Injectable } from '@nestjs/common';
import type { TaxpayerRiskData, HistoricalRiskData } from '../types/risk';
import type { TaxpayerInfo } from '../types/taxpayer';
// TODO: Import mongoose and taxpayer schema
import { Model } from 'mongoose';
import { RiskProfile, Taxpayer, TaxpayerDocument } from 'src/database/schemas/taxpayer.schema';
import { InjectModel } from '@nestjs/mongoose';
import { CreateRiskDto } from './dto/create-risk-dto';

@Injectable()
export class RiskService {
  // TODO: Implement constructor
  constructor(
    @InjectModel(Taxpayer.name) private readonly taxpayerModel: Model<TaxpayerDocument>,
  ){}

  async insertOneTaxpayer(taxpayerData: CreateRiskDto) : Promise<Taxpayer> {
       // Crear una nueva instancia de Taxpayer usando el DTO
       const newTaxpayer = new this.taxpayerModel(taxpayerData);
       // Guardar el nuevo Taxpayer en la base de datos
       return newTaxpayer.save();
  }

  async getTaxpayerRisk(taxpayerId: string): Promise<TaxpayerRiskData | null> {
    // TODO: Implement service method

    // export interface TaxpayerRiskData {
    //   taxpayer: TaxpayerInfo;
    //   riskProfile: RiskProfile;
    //   history: HistoricalRiskData[];
    // }

    const taxpayers = await this.taxpayerModel
      .findOne({'taxpayerInfo.id' : taxpayerId})
      .exec();

    const result = {
      taxpayer: taxpayers.taxpayerInfo,
      riskProfile: taxpayers.riskProfile,
      history: taxpayers.history
    }
    
    return result;
  }

  async getRiskHistory(taxpayerId: string): Promise<HistoricalRiskData[] | null> {
    const taxpayers = await this.taxpayerModel
      .findOne({'taxpayerInfo.id' : taxpayerId})
      .exec();
    
    const historicalData = taxpayers.history
    
    return historicalData ? historicalData : null;
  }
  

  // Método para obtener todos los contribuyentes desde la base de datos
  async getAllTaxpayers(): Promise<TaxpayerInfo[]> {
    // TODO: Implement service method
    // Usamos el modelo de Mongoose para obtener todos los documentos de la colección 'taxpayers', retornando el campo 'taxpayerInfo'
    const taxpayers = await this.taxpayerModel
      .find()
      .exec();

    return taxpayers.map(taxpayer => taxpayer.taxpayerInfo);
  }

}
