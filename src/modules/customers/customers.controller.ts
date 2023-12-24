import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@ApiTags('Customers')
@Controller('v1/customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  @UseGuards(AuthGuard('jwt'))
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  @UseGuards(AuthGuard('jwt'))
  findAll(@Query() queryParams: { dni: string; type: string }) {
    return this.customersService.findCustomerByDniAndType(queryParams);
  }

  @Get(':productNumber')
  @UseGuards(AuthGuard('jwt'))
  findOne(@Param('productNumber') productNumber: string) {
    return this.customersService.findOneByProductNumber(productNumber);
  }

  @Patch(':dni/update')
  @UseGuards(AuthGuard('jwt'))
  update(
    @Param('dni') dni: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(dni, updateCustomerDto);
  }

  @Patch(':dni/remove')
  @UseGuards(AuthGuard('jwt'))
  remove(@Param('dni') dni: string) {
    return this.customersService.remove(dni);
  }
}
