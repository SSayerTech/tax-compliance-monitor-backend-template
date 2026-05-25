import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class MonitoringScheduler {
  @Cron('* * * * *')
  async runScheduledQueries(): Promise<void> {
    // Stub — no scheduled logic in scope for this exercise
    // Optional: if you wish to extend logic further as additional bonus
  }
}
