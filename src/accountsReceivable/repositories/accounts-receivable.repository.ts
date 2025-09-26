import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from '../entities/accounts-receivable.entity';
import { AccountsReceivablePayment } from '../entities/accounts-receivable-payments.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from '../dto/create-accounts-receivable.dto';
import { IAccountsReceivableRepository, IDateRangeQuery } from '../interfaces/accounts-receivable-manager.interface';
import * as dayjs from 'dayjs';

@Injectable()
export class AccountsReceivableRepository implements IAccountsReceivableRepository {
  constructor(
    @InjectRepository(AccountsReceivable)
    private readonly accountsReceivableRepository: Repository<AccountsReceivable>,
    @InjectRepository(AccountsReceivablePayment)
    private readonly paymentRepository: Repository<AccountsReceivablePayment>,
  ) {}

  async findByDateRange(dateRange: IDateRangeQuery): Promise<AccountsReceivable[]> {
    const startOfDay = dayjs(dateRange.startDate).startOf('day').toDate();
    const endOfDay = dayjs(dateRange.endDate).endOf('day').toDate();

    return this.accountsReceivableRepository
      .createQueryBuilder('accountsReceivable')
      .leftJoinAndSelect('accountsReceivable.vehicleId', 'vehicle')
      .where('accountsReceivable.date >= :startDate', { startDate: startOfDay })
      .andWhere('accountsReceivable.date <= :endDate', { endDate: endOfDay })
      .orderBy('accountsReceivable.createAt', 'DESC')
      .getMany();
  }

  async findAll(): Promise<AccountsReceivable[]> {
    return this.accountsReceivableRepository.find({
      relations: ['vehicleId'],
      order: { createAt: 'DESC' }
    });
  }

  async findById(id: string): Promise<AccountsReceivable | null> {
    const accountsReceivable = await this.accountsReceivableRepository.findOne({
      where: { id },
      relations: ['vehicleId'],
    });

    return accountsReceivable || null;
  }

  async findByVehicle(vehicleId: string): Promise<AccountsReceivable[]> {
    return this.accountsReceivableRepository.find({
      where: { vehicleId: { id: vehicleId } },
      relations: ['vehicleId'],
    });
  }

  async findByState(state: number): Promise<AccountsReceivable[]> {
    return this.accountsReceivableRepository.find({
      where: { state },
      relations: ['vehicleId'],
    });
  }

  async create(accountsReceivableData: CreateAccountsReceivableDto): Promise<AccountsReceivable> {
    const newAccountsReceivable = this.accountsReceivableRepository.create({
      ...accountsReceivableData,
      vehicleId: typeof accountsReceivableData.vehicleId === 'string' 
        ? { id: accountsReceivableData.vehicleId } as any
        : accountsReceivableData.vehicleId,
    });

    return this.accountsReceivableRepository.save(newAccountsReceivable);
  }

  async update(id: string, accountsReceivableData: UpdateAccountsReceivableDto): Promise<AccountsReceivable> {
    const existingAccountsReceivable = await this.findById(id);
    
    if (!existingAccountsReceivable) {
      throw new NotFoundException(`Accounts receivable with ID ${id} not found`);
    }
    
    // Handle vehicleId conversion from string to Vehicle object if needed
    const updateData = {
      ...accountsReceivableData,
      ...(accountsReceivableData.vehicleId && {
        vehicleId: typeof accountsReceivableData.vehicleId === 'string' 
          ? { id: accountsReceivableData.vehicleId } as any
          : accountsReceivableData.vehicleId,
      }),
    };
    
    // Merge the update data with the existing entity
    Object.assign(existingAccountsReceivable, updateData);
    
    return this.accountsReceivableRepository.save(existingAccountsReceivable);
  }

  async delete(id: string): Promise<void> {
    const existingAccountsReceivable = await this.findById(id);
    
    if (!existingAccountsReceivable) {
      throw new NotFoundException(`Accounts receivable with ID ${id} not found`);
    }

    // First, delete all related payments to avoid foreign key constraint error
    await this.paymentRepository.delete({
      accountsReceivableId: id,
    });

    // Then delete the accounts receivable record
    await this.accountsReceivableRepository.remove(existingAccountsReceivable);
  }
}
