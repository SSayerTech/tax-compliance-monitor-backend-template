// src/risk/risk.controller.ts
import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { RiskService } from './risk.service';
import { Taxpayer } from 'src/database/schemas/taxpayer.schema';
import { CreateRiskDto } from './dto/create-risk-dto';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('taxpayers')
  async getAllTaxpayers(){
    // TODO: Implement controller method
    return this.riskService.getAllTaxpayers()
  }

  @Post('taxpayers/insertOne')
  async insertOneTaxpayer(@Body() createRiskDto: CreateRiskDto): Promise<Taxpayer> {
    // Llamar al servicio para insertar el nuevo taxpayer
    return this.riskService.insertOneTaxpayer(createRiskDto);
  }

  @Get(':taxpayerId')
  async getTaxpayerRisk(@Param('taxpayerId') taxpayerId: string) {
    // TODO: Implement controller method
    console.log(taxpayerId)
    return this.riskService.getTaxpayerRisk(taxpayerId);
  }

  @Get(':taxpayerId/history')
  async getRiskHistory(@Param('taxpayerId') taxpayerId: string) {
    // TODO: Implement controller method
    console.log(taxpayerId)
    return this.riskService.getRiskHistory(taxpayerId)
  }
}
