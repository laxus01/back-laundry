import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountsReceivablePaymentsService } from './accounts-receivable-payments.service';
import { CreateAccountsReceivablePaymentDto, UpdateAccountsReceivablePaymentDto } from './dto/accounts-receivable-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('accounts-receivable-payments')
export class AccountsReceivablePaymentsController {
  constructor(private readonly accountsReceivablePaymentsService: AccountsReceivablePaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccountsReceivablePayments() {
    return this.accountsReceivablePaymentsService.getAccountsReceivablePayments();
  }

  @UseGuards(JwtAuthGuard)
  @Get('by-accounts-receivable/:accountsReceivableId')
  async getAccountsReceivablePaymentsByAccountsReceivableId(@Param('accountsReceivableId') accountsReceivableId: string) {
    return this.accountsReceivablePaymentsService.getAccountsReceivablePaymentsByAccountsReceivableId(accountsReceivableId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccountsReceivablePaymentById(@Param('id') id: string) {
    return this.accountsReceivablePaymentsService.getAccountsReceivablePaymentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccountsReceivablePayment(@Body() createAccountsReceivablePaymentDto: CreateAccountsReceivablePaymentDto) {
    return this.accountsReceivablePaymentsService.createAccountsReceivablePayment(createAccountsReceivablePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAccountsReceivablePayment(
    @Param('id') id: string,
    @Body() updateAccountsReceivablePaymentDto: UpdateAccountsReceivablePaymentDto,
  ) {
    return this.accountsReceivablePaymentsService.updateAccountsReceivablePayment(id, updateAccountsReceivablePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAccountsReceivablePayment(@Param('id') id: string) {
    await this.accountsReceivablePaymentsService.deleteAccountsReceivablePayment(id);
    return { message: 'Accounts receivable payment deleted successfully' };
  }
}
