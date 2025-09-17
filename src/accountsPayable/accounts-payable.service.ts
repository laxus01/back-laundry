import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsPayable } from './entities/accounts-payable.entity';
import { CreateAccountsPayableDto, UpdateAccountsPayableDto } from './dto/create-accounts-payable.dto';

@Injectable()
export class AccountsPayableService {
  constructor(
    @InjectRepository(AccountsPayable)
    private accountsPayableRepository: Repository<AccountsPayable>,
  ) {}

  async getAccountsPayable() {
    return this.accountsPayableRepository.find({
      relations: ['providerId'],
    });
  }

  async getAccountsPayableById(id: string) {
    return this.accountsPayableRepository.findOne({
      where: { id },
      relations: ['providerId'],
    });
  }

  async createAccountsPayable(accountsPayable: CreateAccountsPayableDto) {
    const newAccountsPayable = this.accountsPayableRepository.create({
      ...accountsPayable,
      providerId: { id: accountsPayable.providerId } as any,
    });
    return this.accountsPayableRepository.save(newAccountsPayable);
  }

  async updateAccountsPayable(id: string, accountsPayable: UpdateAccountsPayableDto) {
    const existingAccountsPayable = await this.accountsPayableRepository.findOne({
      where: { id },
    });
    if (!existingAccountsPayable) {
      throw new Error('Accounts payable not found');
    }
    
    // Handle providerId conversion if provided
    const updateData = { ...accountsPayable };
    if (accountsPayable.providerId) {
      updateData.providerId = { id: accountsPayable.providerId } as any;
    }
    
    const updatedAccountsPayable = { ...existingAccountsPayable, ...updateData };
    return this.accountsPayableRepository.save(updatedAccountsPayable);
  }

  async deleteAccountsPayable(id: string) {
    const existingAccountsPayable = await this.accountsPayableRepository.findOne({
      where: { id },
    });
    if (!existingAccountsPayable) {
      throw new Error('Accounts payable not found');
    }
    return this.accountsPayableRepository.remove(existingAccountsPayable);
  }

  async getAccountsPayableByProvider(providerId: string) {
    return this.accountsPayableRepository.find({
      where: { providerId: { id: providerId } },
      relations: ['providerId'],
    });
  }

  async getAccountsPayableByState(state: number) {
    return this.accountsPayableRepository.find({
      where: { state },
      relations: ['providerId'],
    });
  }
}
