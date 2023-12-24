import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';

@Controller('customers')
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @Post()
  create(@Body() createCustomerDto: CreateCustomerDto) {
    return this.customersService.create(createCustomerDto);
  }

  @Get()
  findAll(@Query() queryParams: { dni: string; type: string }) {
    return this.customersService.findCustomerByDniAndType(queryParams);
  }

  @Get(':productNumber')
  findOne(@Param('productNumber') productNumber: string) {
    return this.customersService.findOneByProductNumber(productNumber);
  }

  @Patch(':dni/update')
  update(
    @Param('dni') dni: string,
    @Body() updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.customersService.update(dni, updateCustomerDto);
  }

  @Patch(':dni/remove')
  remove(@Param('dni') dni: string) {
    return this.customersService.remove(dni);
  }
}
