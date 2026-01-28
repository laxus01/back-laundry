import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { AdvancesService } from './advances.service';
import { CreateAdvanceDto, UpdateAdvanceDto } from './dto/create-advance.dto';

@Controller('advances')
export class AdvancesController {
    constructor(private readonly advancesService: AdvancesService) {}

    @Get()
    async getAdvances() {
        return this.advancesService.getAdvances();
    }

    @Get(':id')
    async getAdvanceById(@Param('id') id: string) {
        return this.advancesService.getAdvanceById(id);
    }

    @Post()
    async createAdvance(@Body() advance: CreateAdvanceDto) {
        return this.advancesService.createAdvance(advance);
    }

    @Put(':id')
    async updateAdvance(@Param('id') id: string, @Body() advance: UpdateAdvanceDto) {
        return this.advancesService.updateAdvance(id, advance);
    }

    @Delete(':id')
    async deleteAdvance(@Param('id') id: string) {
        return this.advancesService.deleteAdvance(id);
    }
}
