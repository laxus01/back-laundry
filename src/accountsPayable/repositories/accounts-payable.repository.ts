import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayable } from '../entities/accounts-payable.entity';
import { AccountsPayablePayment } from '../entities/accounts-payable-payments.entity';
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from '../dto/create-accounts-payable.dto';
import { IAccountsPayableRepository, IDateRangeQuery } from '../interfaces/accounts-payable-manager.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountsPayableRepository implements IAccountsPayableRepository {
  constructor(
    @InjectRepository(AccountsPayable)
    private readonly accountsPayableRepository: Repository<AccountsPayable>,
    @InjectRepository(AccountsPayablePayment)
    private readonly paymentRepository: Repository<AccountsPayablePayment>,
  ) {}

  async findByDateRange(dateRange: IDateRangeQuery): Promise<AccountsPayable[]> {
    const startOfDay = dayjs(dateRange.startDate).startOf('day').toDate();
    const endOfDay = dayjs(dateRange.endDate).endOf('day').toDate();

    return this.accountsPayableRepository
      .createQueryBuilder('accountsPayable')
      .leftJoinAndSelect('accountsPayable.providerId', 'provider')
      .where('accountsPayable.date >= :startDate', { startDate: startOfDay })
      .andWhere('accountsPayable.date <= :endDate', { endDate: endOfDay })
      .orderBy('accountsPayable.createAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<AccountsPayable[]> {
    return this.accountsPayableRepository.find({
      relations: ['providerId'],
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<AccountsPayable | null> {
    const accountsPayable = await this.accountsPayableRepository.findOne({
      where: { id },
      relations: ['providerId'],
    });

    return accountsPayable || null;
  }

  async findByProvider(providerId: string): Promise<AccountsPayable[]> {
    return this.accountsPayableRepository.find({
      where: { providerId: { id: providerId } },
      relations: ['providerId'],
    });
  }

  async findByState(state: number): Promise<AccountsPayable[]> {
    return this.accountsPayableRepository.find({
      where: { state },
      relations: ['providerId'],
    });
  }

  async create(accountsPayableData: CreateAccountsPayableDto): Promise<AccountsPayable> {
    const newAccountsPayable = this.accountsPayableRepository.create({
      ...accountsPayableData,
      providerId: typeof accountsPayableData.providerId === 'string' 
        ? { id: accountsPayableData.providerId } as any
        : accountsPayableData.providerId,
    });

    return this.accountsPayableRepository.save(newAccountsPayable);
  }

  async update(id: string, accountsPayableData: UpdateAccountsPayableDto): Promise<AccountsPayable> {
    const existingAccountsPayable = await this.findById(id);
    
    if (!existingAccountsPayable) {
      throw new NotFoundException(`Accounts payable with ID ${id} not found`);
    }
    
    const updateData = {
      ...accountsPayableData,
      ...(accountsPayableData.providerId && {
        providerId: typeof accountsPayableData.providerId === 'string' 
          ? { id: accountsPayableData.providerId } as any
          : accountsPayableData.providerId,
      }),
    };
    
    Object.assign(existingAccountsPayable, updateData);
    
    return this.accountsPayableRepository.save(existingAccountsPayable);
  }

  async delete(id: string): Promise<void> {
    const existingAccountsPayable = await this.findById(id);
    
    if (!existingAccountsPayable) {
      throw new NotFoundException(`Accounts payable with ID ${id} not found`);
    }

    // First, delete all related payments to avoid foreign key constraint error
    await this.paymentRepository.delete({
      accountsPayableId: id,
    });

    // Then delete the accounts payable record
    await this.accountsPayableRepository.remove(existingAccountsPayable);
  }
}
