import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { OurServicesService } from './our-services.service';
import { CreateServiceDto } from './dto/create-service.dto';

@Controller('our-services')
export class OurServicesController {
    constructor(private readonly ourServicesService: OurServicesService) {}

    @Get()
    async getServices() {
        return this.ourServicesService.getServices();
    }

    @Get(':id')
    async getServiceById(@Param('id') id: number) {
        return this.ourServicesService.getServiceById(id);
    }

    @Post()
    async createService(@Body() service: CreateServiceDto) {
        return this.ourServicesService.createService(service);
    }

    @Put(':id')
    async updateService(@Param('id') id: number, @Body() service: CreateServiceDto) {
        return this.ourServicesService.updateService(id, service);
    }

    @Delete(':id')
    async deleteService(@Param('id') id: number) {
        return this.ourServicesService.deleteService(id);
    }
}