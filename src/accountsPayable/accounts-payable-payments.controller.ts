import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { AccountsPayablePaymentsService } from './accounts-payable-payments.service';
import { CreateAccountsPayablePaymentDto, UpdateAccountsPayablePaymentDto } from './dto/accounts-payable-payment.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('accounts-payable-payments')
export class AccountsPayablePaymentsController {
  constructor(private readonly accountsPayablePaymentsService: AccountsPayablePaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Get()
  async getAccountsPayablePayments() {
    return this.accountsPayablePaymentsService.getAccountsPayablePayments();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async getAccountsPayablePaymentById(@Param('id') id: string) {
    return this.accountsPayablePaymentsService.getAccountsPayablePaymentById(id);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  async createAccountsPayablePayment(@Body() createAccountsPayablePaymentDto: CreateAccountsPayablePaymentDto) {
    return this.accountsPayablePaymentsService.createAccountsPayablePayment(createAccountsPayablePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async updateAccountsPayablePayment(
    @Param('id') id: string,
    @Body() updateAccountsPayablePaymentDto: UpdateAccountsPayablePaymentDto,
  ) {
    return this.accountsPayablePaymentsService.updateAccountsPayablePayment(id, updateAccountsPayablePaymentDto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async deleteAccountsPayablePayment(@Param('id') id: string) {
    await this.accountsPayablePaymentsService.deleteAccountsPayablePayment(id);
    return { message: 'Accounts payable payment deleted successfully' };
  }
}
