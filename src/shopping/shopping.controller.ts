import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ShoppingService } from './shopping.service';
import { CreateShoppingDto } from './dto/create-shopping.dto';

@Controller('shopping')
export class ShoppingController {
    constructor(private readonly shoppingService: ShoppingService) {}

    @Get()
    async getShoppings() {
        return this.shoppingService.getShoppings();
    }

    @Get(':id')
    async getShoppingById(@Param('id') id: number) {
        return this.shoppingService.getShoppingById(id);
    }

    @Post()
    async createShopping(@Body() shopping: CreateShoppingDto) {
        return this.shoppingService.createShopping(shopping);
    }

    @Put(':id')
    async updateShopping(@Param('id') id: number, @Body() shopping: CreateShoppingDto) {
        return this.shoppingService.updateShopping(id, shopping);
    }

    @Delete(':id')
    async deleteShopping(@Param('id') id: number) {
        return this.shoppingService.deleteShopping(id);
    }
}