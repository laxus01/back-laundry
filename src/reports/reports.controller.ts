import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';

@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('washer-activity')
  async getWasherActivityReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Query('washerId') washerId: string,
  ) {
    return await this.reportsService.getWasherActivityReport(startDate, endDate, washerId);
  }

  @Get('financial')
  async getFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return await this.reportsService.getFinancialReport(startDate, endDate);
  }
}
