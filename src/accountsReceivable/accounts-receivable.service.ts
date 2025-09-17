import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AccountsReceivable } from './entities/accounts-receivable.entity';
import { CreateAccountsReceivableDto, UpdateAccountsReceivableDto } from './dto/create-accounts-receivable.dto';

@Injectable()
export class AccountsReceivableService {
  constructor(
    @InjectRepository(AccountsReceivable)
    private accountsReceivableRepository: Repository<AccountsReceivable>,
  ) {}

  async getAccountsReceivable() {
    return this.accountsReceivableRepository.find({
      relations: ['clientId'],
    });
  }

  async getAccountsReceivableById(id: string) {
    return this.accountsReceivableRepository.findOne({
      where: { id },
      relations: ['clientId'],
    });
  }

  async createAccountsReceivable(accountsReceivable: CreateAccountsReceivableDto) {
    const newAccountsReceivable = this.accountsReceivableRepository.create({
      ...accountsReceivable,
      clientId: { id: accountsReceivable.clientId } as any,
    });
    return this.accountsReceivableRepository.save(newAccountsReceivable);
  }

  async updateAccountsReceivable(id: string, accountsReceivable: UpdateAccountsReceivableDto) {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findOne({
        where: { id },
      });
      if (!existingAccountsReceivable) {
        throw new Error('Accounts receivable not found');
      }
      const updatedAccountsReceivable = { ...existingAccountsReceivable, ...accountsReceivable };
      return this.accountsReceivableRepository.save(updatedAccountsReceivable);
  }

  async deleteAccountsReceivable(id: string) {
    const existingAccountsReceivable = await this.accountsReceivableRepository.findOne({
      where: { id },
    });
    if (!existingAccountsReceivable) {
      throw new Error('Accounts receivable not found');
    }
    return this.accountsReceivableRepository.remove(existingAccountsReceivable);
  }

  async getAccountsReceivableByClient(clientId: string) {
    return this.accountsReceivableRepository.find({
      where: { clientId: { id: clientId } },
      relations: ['clientId'],
    });
  }

  async getAccountsReceivableByState(state: number) {
    return this.accountsReceivableRepository.find({
      where: { state },
      relations: ['clientId'],
    });
  }
}
