import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto, UpdateServiceDto } from './dto/create-service.dto';

@Controller('services')
export class ServicesController {
    constructor(private readonly ourServicesService: ServicesService) {}

    @Get()
    async getServices() {
        return this.ourServicesService.getServices();
    }

    @Get(':id')
    async getServiceById(@Param('id') id: string) {
        return this.ourServicesService.getServiceById(id);
    }

    @Post()
    async createService(@Body() service: CreateServiceDto) {
        return this.ourServicesService.createService(service);
    }

    @Put(':id')
    async updateService(@Param('id') id: string, @Body() service: UpdateServiceDto) {
        return this.ourServicesService.updateService(id, service);
    }

    @Delete(':id')
    async deleteService(@Param('id') id: string) {
        return this.ourServicesService.deleteService(id);
    }
}