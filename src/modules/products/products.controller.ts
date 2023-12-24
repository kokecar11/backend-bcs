import { Controller, Post, Body, Patch, Param, Get } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post(':customerDni/create')
  addProductCustomer(
    @Param('customerDni') customerDni: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.addProduct(customerDni, createProductDto);
  }

  @Patch(':productNumber/update')
  update(
    @Param('productNumber') productNumber: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productNumber, updateProductDto);
  }

  @Patch(':productNumber/remove')
  remove(@Param('productNumber') productNumber: string) {
    return this.productsService.remove(productNumber);
  }
}
