import { Controller, Get, Param, Post, Body, Put, Delete, UseGuards } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('shopping')
export class ShoppingController {
    constructor(private readonly shoppingService: ShoppingService) {}

    @UseGuards(JwtAuthGuard)
    @Get()
    async getShoppings() {
        return this.shoppingService.getShoppings();
    }

    @UseGuards(JwtAuthGuard)
    @Get(':id')
    async getShoppingById(@Param('id') id: number) {
        return this.shoppingService.getShoppingById(id);
    }

    @UseGuards(JwtAuthGuard)
    @Post()
    async createShopping(@Body() shopping: CreateShoppingDto) {
        return this.shoppingService.createShopping(shopping);
    }

    @UseGuards(JwtAuthGuard)
    @Put(':id')
    async updateShopping(@Param('id') id: number, @Body() shopping: CreateShoppingDto) {
        return this.shoppingService.updateShopping(id, shopping);
    }

    @UseGuards(JwtAuthGuard)
    @Delete(':id')
    async deleteShopping(@Param('id') id: number) {
        return this.shoppingService.deleteShopping(id);
    }
}