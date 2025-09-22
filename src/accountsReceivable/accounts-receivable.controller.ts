import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { AccountsReceivableService } from './accounts-receivable.service';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('accounts-receivable')
export class AccountsReceivableController {
    constructor(private readonly accountsReceivableService: AccountsReceivableService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAccountsReceivable(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        return this.accountsReceivableService.getAccountsReceivable(startDate, endDate);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-vehicle/:vehicleId')
    async getAccountsReceivableByVehicle(@Param('vehicleId') vehicleId: string) {
        return this.accountsReceivableService.getAccountsReceivableByVehicle(vehicleId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-state')
    async getAccountsReceivableByState(@Query('state') state: number) {
        return this.accountsReceivableService.getAccountsReceivableByState(Number(state));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAccountsReceivableById(@Param('id') id: string) {
        return this.accountsReceivableService.getAccountsReceivableById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAccountsReceivable(@Body() accountsReceivable: CreateAccountsReceivableDto) {
        return this.accountsReceivableService.createAccountsReceivable(accountsReceivable);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateAccountsReceivable(@Param('id') id: string, @Body() accountsReceivable: UpdateAccountsReceivableDto) {
        return this.accountsReceivableService.updateAccountsReceivable(id, accountsReceivable);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteAccountsReceivable(@Param('id') id: string) {
        return this.accountsReceivableService.deleteAccountsReceivable(id);
    }
}
