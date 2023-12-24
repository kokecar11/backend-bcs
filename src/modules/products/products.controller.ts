import {
  Controller,
  Post,
  Body,
  Patch,
  Param,
  Get,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@ApiTags('Products')
@Controller('v1/products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll() {
    return this.productsService.findAll();
  }

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Post(':customerDni/create')
  @UseGuards(AuthGuard('jwt'))
  addProductCustomer(
    @Param('customerDni') customerDni: string,
    @Body() createProductDto: CreateProductDto,
  ) {
    return this.productsService.addProduct(customerDni, createProductDto);
  }

  @Patch(':productNumber/update')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('productNumber') productNumber: string,
    @Body() updateProductDto: UpdateProductDto,
  ) {
    return this.productsService.update(productNumber, updateProductDto);
  }

  @Patch(':productNumber/remove')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('productNumber') productNumber: string) {
    return this.productsService.remove(productNumber);
  }
}
