import { Controller, Get, Param } from '@nestjs/common';
import { RiskService } from './risk.service';

@Controller('risk')
export class RiskController {
  constructor(private readonly riskService: RiskService) {}

  @Get('taxpayers')
  async getAllTaxpayers() {
    return this.riskService.getAllTaxpayers();
  }

  @Get(':taxpayerId')
  async getTaxpayerRisk(@Param('taxpayerId') taxpayerId: string) {
    return this.riskService.getTaxpayerRisk(taxpayerId);
  }

  @Get(':taxpayerId/history')
  async getRiskHistory(@Param('taxpayerId') taxpayerId: string) {
    return this.riskService.getRiskHistory(taxpayerId);
  }
}
