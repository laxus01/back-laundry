import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivablePayment } from './entities/accounts-receivable-payments.entity';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { CreateAccountsReceivablePaymentDto, UpdateAccountsReceivablePaymentDto } from './dto/accounts-receivable-payment.dto';

@Injectable()
export class AccountsReceivablePaymentsService {
  constructor(
    @InjectRepository(AccountsReceivablePayment)
    private accountsReceivablePaymentRepository: Repository<AccountsReceivablePayment>,
    @InjectRepository(AccountsReceivable)
    private accountsReceivableRepository: Repository<AccountsReceivable>,
  ) {}

  private async updateAccountsReceivableState(accountsReceivableId: string): Promise<void> {
    // Get the accounts receivable record
    const accountsReceivable = await this.accountsReceivableRepository.findOne({
      where: { id: accountsReceivableId },
    });

    if (!accountsReceivable) {
      throw new NotFoundException(`Accounts receivable with ID ${accountsReceivableId} not found`);
    }

    // Calculate total payments for this accounts receivable
    const payments = await this.accountsReceivablePaymentRepository.find({
      where: { accountsReceivableId },
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

    // Update state based on payment comparison
    // state = 0 if fully paid (totalPaid >= accountsReceivable.value)
    // state = 1 if not fully paid (totalPaid < accountsReceivable.value)
    const newState = totalPaid >= accountsReceivable.value ? 0 : 1;

    if (accountsReceivable.state !== newState) {
      await this.accountsReceivableRepository.update(accountsReceivableId, { state: newState });
    }
  }

  async createAccountsReceivablePayment(createAccountsReceivablePaymentDto: CreateAccountsReceivablePaymentDto): Promise<AccountsReceivablePayment> {
    const accountsReceivablePayment = this.accountsReceivablePaymentRepository.create(createAccountsReceivablePaymentDto);
    const savedPayment = await this.accountsReceivablePaymentRepository.save(accountsReceivablePayment);
    
    // Update accounts receivable state after creating payment
    await this.updateAccountsReceivableState(createAccountsReceivablePaymentDto.accountsReceivableId);
    
    return savedPayment;
  }

  async updateAccountsReceivablePayment(id: string, updateAccountsReceivablePaymentDto: UpdateAccountsReceivablePaymentDto): Promise<AccountsReceivablePayment> {
    const existingPayment = await this.accountsReceivablePaymentRepository.findOne({
      where: { id },
    });

    if (!existingPayment) {
      throw new NotFoundException(`Accounts receivable payment with ID ${id} not found`);
    }

    const updateData: any = { ...updateAccountsReceivablePaymentDto };
    
    if (updateAccountsReceivablePaymentDto.accountsReceivableId) {
      updateData.accountsReceivable = { id: updateAccountsReceivablePaymentDto.accountsReceivableId };
      delete updateData.accountsReceivableId;
    }

    const updatedPayment = { ...existingPayment, ...updateData };
    const savedPayment = await this.accountsReceivablePaymentRepository.save(updatedPayment);
    
    // Update accounts receivable state after updating payment
    // Use the accountsReceivableId from the update data or existing payment
    const accountsReceivableId = updateAccountsReceivablePaymentDto.accountsReceivableId || existingPayment.accountsReceivableId;
    await this.updateAccountsReceivableState(accountsReceivableId);
    
    return savedPayment;
  }

  async getAccountsReceivablePayments(): Promise<any[]> {
    const payments = await this.accountsReceivablePaymentRepository.find({
      relations: ['accountsReceivable'],
    });

    // Group payments by accounts receivable to calculate saldo for each accounts receivable
    const paymentsByAccountsReceivable = new Map<string, AccountsReceivablePayment[]>();
    
    payments.forEach(payment => {
      const accountsReceivableId = payment.accountsReceivableId;
      if (!paymentsByAccountsReceivable.has(accountsReceivableId)) {
        paymentsByAccountsReceivable.set(accountsReceivableId, []);
      }
      paymentsByAccountsReceivable.get(accountsReceivableId)!.push(payment);
    });

    return payments;
  }

  async getAccountsReceivablePaymentsByAccountsReceivableId(accountsReceivableId: string): Promise<any[]> {
    // First verify that the accounts receivable exists
    const accountsReceivable = await this.accountsReceivableRepository.findOne({
      where: { id: accountsReceivableId },
    });

    if (!accountsReceivable) {
      // Return empty array if accounts receivable doesn't exist
      return [];
    }

    // Get all payments for this accounts receivable
    const payments = await this.accountsReceivablePaymentRepository.find({
      where: { accountsReceivableId },
      relations: ['accountsReceivable'],
    });

    // Return empty array if no payments found
    if (payments.length === 0) {
      return [];
    }

    return payments;
  }

  async getAccountsReceivablePaymentById(id: string): Promise<AccountsReceivablePayment> {
    const payment = await this.accountsReceivablePaymentRepository.findOne({
      where: { id },
      relations: ['accountsReceivable'],
    });

    if (!payment) {
      throw new NotFoundException(`Accounts receivable payment with ID ${id} not found`);
    }

    return payment;
  }

  async deleteAccountsReceivablePayment(id: string): Promise<void> {
    const payment = await this.accountsReceivablePaymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Accounts receivable payment with ID ${id} not found`);
    }

    const accountsReceivableId = payment.accountsReceivableId;
    await this.accountsReceivablePaymentRepository.remove(payment);
    
    // Update accounts receivable state after deleting payment
    await this.updateAccountsReceivableState(accountsReceivableId);
  }
}
