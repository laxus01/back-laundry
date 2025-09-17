import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards, Query } from '@nestjs/common';
import { AccountsPayableService } from 'src/accountsPayable/accounts-payable.service';
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from 'src/accountsPayable/dto/create-accounts-payable.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('accounts-payable')
export class AccountsPayableController {
    constructor(private readonly accountsPayableService: AccountsPayableService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getAccountsPayable() {
        return this.accountsPayableService.getAccountsPayable();
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-provider/:providerId')
    async getAccountsPayableByProvider(@Param('providerId') providerId: string) {
        return this.accountsPayableService.getAccountsPayableByProvider(providerId);
    }

    @UseGuards(JwtAuthGuard)
    @Get('by-state')
    async getAccountsPayableByState(@Query('state') state: number) {
        return this.accountsPayableService.getAccountsPayableByState(Number(state));
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getAccountsPayableById(@Param('id') id: string) {
        return this.accountsPayableService.getAccountsPayableById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createAccountsPayable(@Body() accountsPayable: CreateAccountsPayableDto) {
        return this.accountsPayableService.createAccountsPayable(accountsPayable);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateAccountsPayable(@Param('id') id: string, @Body() accountsPayable: UpdateAccountsPayableDto) {
        return this.accountsPayableService.updateAccountsPayable(id, accountsPayable);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteAccountsPayable(@Param('id') id: string) {
        return this.accountsPayableService.deleteAccountsPayable(id);
    }
}
