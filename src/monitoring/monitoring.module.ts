import { Module } from '@nestjs/common';
import { MonitoringScheduler } from './monitoring.scheduler';

@Module({
  providers: [MonitoringScheduler],
})
export class MonitoringModule {}
