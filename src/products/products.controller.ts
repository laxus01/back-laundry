import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async getProducts() {
        return this.productsService.getVehicles();
    }

    @Get(':id')
    async getProductById(@Param('id') id: number) {
        return this.productsService.getVehicleById(id);
    }

    @Post()
    async createProduct(@Body() product: CreateProductDto) {
        return this.productsService.createVehicle(product);
    }

    @Put(':id')
    async updateProduct(@Param('id') id: number, @Body() product: CreateProductDto) {
        return this.productsService.updateVehicle(id, product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: number) {
        return this.productsService.deleteVehicle(id);
    }
}