import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { CreateClientDto } from './dto/create-client.dto';

@Controller('clients')
export class ClientsController {
    constructor(private readonly clientsService: ClientsService) {}

    @Get()
    async getClients() {
        return this.clientsService.getClients();
    }

    @Get(':id')
    async getClientById(@Param('id') id: string) {
        return this.clientsService.getClientById(id);
    }

    @Post()
    async createClient(@Body() client: CreateClientDto) {
        return this.clientsService.createClient(client);
    }

    @Put(':id')
    async updateClient(@Param('id') id: string, @Body() client: CreateClientDto) {
        return this.clientsService.updateClient(id, client);
    }

    @Delete(':id')
    async deleteClient(@Param('id') id: string) {
        return this.clientsService.deleteClient(id);
    }
}