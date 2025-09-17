import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('washer-activity')
  async getWasherActivityReport(
    @Query('date') date: string,
    @Query('washerId') washerId: string,
  ) {
    return await this.reportsService.getWasherActivityReport(date, washerId);
  }
}
