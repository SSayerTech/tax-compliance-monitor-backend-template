// src/risk/risk.controller.ts
import { Controller, Get, Param, NotFoundException } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('taxpayers')
  async getAllTaxpayers() {
    const taxpayers = await this.riskService.getAllTaxpayers();
    if (!taxpayers.length) {
      throw new NotFoundException('No taxpayers found');
    }
    return taxpayers;
  }

  @Get(':taxpayerId')
  async getTaxpayerRisk(@Param('taxpayerId') taxpayerId: string) {
    const risk = await this.riskService.getTaxpayerRisk(taxpayerId);
    if (!risk) {
      throw new NotFoundException(`Taxpayer ${taxpayerId} not found`);
    }
    return risk;
  }

  @Get(':taxpayerId/history')
  async getRiskHistory(@Param('taxpayerId') taxpayerId: string) {
    const history = await this.riskService.getRiskHistory(taxpayerId);
    if (!history) {
      throw new NotFoundException(
        `History for taxpayer ${taxpayerId} not found`,
      );
    }
    return history;
  }
}
