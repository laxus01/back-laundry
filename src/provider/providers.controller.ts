import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { CreateProviderDto } from './dto/create-provider.dto';

@Controller('providers')
export class ProvidersController {
    constructor(private readonly providersService: ProvidersService) {}

    @Get()
    async getProviders() {
        return this.providersService.getProviders();
    }

    @Get(':id')
    async getProviderById(@Param('id') id: string) {
        return this.providersService.getProviderById(id);
    }

    @Post()
    async createProvider(@Body() provider: CreateProviderDto) {
        return this.providersService.createProvider(provider);
    }

    @Put(':id')
    async updateProvider(@Param('id') id: string, @Body() provider: CreateProviderDto) {
        return this.providersService.updateProvider(id, provider);
    }

    @Delete(':id')
    async deleteProvider(@Param('id') id: string) {
        return this.providersService.deleteProvider(id);
    }
}
