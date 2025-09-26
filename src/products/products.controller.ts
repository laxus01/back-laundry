import { Controller, Get, Param, Post, Body, Put, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) {}

    @Get()
    async getProducts() {
        return this.productsService.getProducts();
    }

    @Get(':id')
    async getProductById(@Param('id') id: string) {
        return this.productsService.getProductById(id);
    }

    @Post()
    async createProduct(@Body() product: CreateProductDto) {
        return this.productsService.createProduct(product);
    }

    @Put(':id')
    async updateProduct(@Param('id') id: string, @Body() product: UpdateProductDto) {
        return this.productsService.updateProduct(id, product);
    }

    @Delete(':id')
    async deleteProduct(@Param('id') id: string) {
        return this.productsService.deleteProduct(id);
    }
}