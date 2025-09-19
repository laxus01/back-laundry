import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayablePayment } from './entities/accounts-payable-payments.entity';
import { AccountsPayable } from './entities/accounts-payable.entity';
import { CreateAccountsPayablePaymentDto, UpdateAccountsPayablePaymentDto } from './dto/accounts-payable-payment.dto';

@Injectable()
export class AccountsPayablePaymentsService {
  constructor(
    @InjectRepository(AccountsPayablePayment)
    private accountsPayablePaymentRepository: Repository<AccountsPayablePayment>,
    @InjectRepository(AccountsPayable)
    private accountsPayableRepository: Repository<AccountsPayable>,
  ) {}

  private async updateAccountsPayableState(accountsPayableId: string): Promise<void> {
    // Get the accounts payable record
    const accountsPayable = await this.accountsPayableRepository.findOne({
      where: { id: accountsPayableId },
    });

    if (!accountsPayable) {
      throw new NotFoundException(`Accounts payable with ID ${accountsPayableId} not found`);
    }

    // Calculate total payments for this accounts payable
    const payments = await this.accountsPayablePaymentRepository.find({
      where: { accountsPayableId },
    });

    const totalPaid = payments.reduce((sum, payment) => sum + payment.value, 0);

    // Update state based on payment comparison
    // state = 0 if fully paid (totalPaid >= accountsPayable.value)
    // state = 1 if not fully paid (totalPaid < accountsPayable.value)
    const newState = totalPaid >= accountsPayable.value ? 0 : 1;

    if (accountsPayable.state !== newState) {
      await this.accountsPayableRepository.update(accountsPayableId, { state: newState });
    }
  }

  async createAccountsPayablePayment(createAccountsPayablePaymentDto: CreateAccountsPayablePaymentDto): Promise<AccountsPayablePayment> {
    const accountsPayablePayment = this.accountsPayablePaymentRepository.create(createAccountsPayablePaymentDto);
    const savedPayment = await this.accountsPayablePaymentRepository.save(accountsPayablePayment);
    
    // Update accounts payable state after creating payment
    await this.updateAccountsPayableState(createAccountsPayablePaymentDto.accountsPayableId);
    
    return savedPayment;
  }

  async updateAccountsPayablePayment(id: string, updateAccountsPayablePaymentDto: UpdateAccountsPayablePaymentDto): Promise<AccountsPayablePayment> {
    const existingPayment = await this.accountsPayablePaymentRepository.findOne({
      where: { id },
    });

    if (!existingPayment) {
      throw new NotFoundException(`Accounts payable payment with ID ${id} not found`);
    }

    const updateData: any = { ...updateAccountsPayablePaymentDto };
    
    if (updateAccountsPayablePaymentDto.accountsPayableId) {
      updateData.accountsPayable = { id: updateAccountsPayablePaymentDto.accountsPayableId };
      delete updateData.accountsPayableId;
    }

    const updatedPayment = { ...existingPayment, ...updateData };
    const savedPayment = await this.accountsPayablePaymentRepository.save(updatedPayment);
    
    // Update accounts payable state after updating payment
    // Use the accountsPayableId from the update data or existing payment
    const accountsPayableId = updateAccountsPayablePaymentDto.accountsPayableId || existingPayment.accountsPayableId;
    await this.updateAccountsPayableState(accountsPayableId);
    
    return savedPayment;
  }

  async getAccountsPayablePayments(): Promise<any[]> {
    const payments = await this.accountsPayablePaymentRepository.find({
      relations: ['accountsPayable'],
    });

    // Group payments by accounts payable to calculate saldo for each accounts payable
    const paymentsByAccountsPayable = new Map<string, AccountsPayablePayment[]>();
    
    payments.forEach(payment => {
      const accountsPayableId = payment.accountsPayableId;
      if (!paymentsByAccountsPayable.has(accountsPayableId)) {
        paymentsByAccountsPayable.set(accountsPayableId, []);
      }
      paymentsByAccountsPayable.get(accountsPayableId)!.push(payment);
    });

    // Calculate saldo for each payment and add it to the response
    return payments.map(payment => {
      const accountsPayablePayments = paymentsByAccountsPayable.get(payment.accountsPayableId) || [];
      const totalPaid = accountsPayablePayments.reduce((sum, p) => sum + p.value, 0);
      const saldo = payment.accountsPayable.value - totalPaid;

      return {
        ...payment,
        saldo
      };
    });
  }

  async getAccountsPayablePaymentsByAccountsPayableId(accountsPayableId: string): Promise<any[]> {
    // First verify that the accounts payable exists
    const accountsPayable = await this.accountsPayableRepository.findOne({
      where: { id: accountsPayableId },
    });

    if (!accountsPayable) {
      // Return empty array if accounts payable doesn't exist
      return [];
    }

    // Get all payments for this accounts payable
    const payments = await this.accountsPayablePaymentRepository.find({
      where: { accountsPayableId },
      relations: ['accountsPayable'],
    });

    // Return empty array if no payments found
    if (payments.length === 0) {
      return [];
    }

    return payments;
  }

  async getAccountsPayablePaymentById(id: string): Promise<AccountsPayablePayment> {
    const payment = await this.accountsPayablePaymentRepository.findOne({
      where: { id },
      relations: ['accountsPayable'],
    });

    if (!payment) {
      throw new NotFoundException(`Accounts payable payment with ID ${id} not found`);
    }

    return payment;
  }

  async deleteAccountsPayablePayment(id: string): Promise<void> {
    const payment = await this.accountsPayablePaymentRepository.findOne({
      where: { id },
    });

    if (!payment) {
      throw new NotFoundException(`Accounts payable payment with ID ${id} not found`);
    }

    const accountsPayableId = payment.accountsPayableId;
    await this.accountsPayablePaymentRepository.remove(payment);
    
    // Update accounts payable state after deleting payment
    await this.updateAccountsPayableState(accountsPayableId);
  }
}
