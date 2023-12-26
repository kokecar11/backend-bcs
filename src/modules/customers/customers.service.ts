import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Customers, CustomersDocument } from './schemas/customer.schema';
import { Model } from 'mongoose';
@Injectable()
export class CustomersService {
  constructor(
    @InjectModel(Customers.name)
    private customersModule: Model<CustomersDocument>,
  ) {}
  async create(createCustomerDto: CreateCustomerDto) {
    const { dni } = createCustomerDto;
    const customer = await this.customersModule.findOne({
      dni,
      isDelete: false,
    });
    if (customer) {
      throw new BadRequestException('Customer already exists');
    }
    return await this.customersModule.create(createCustomerDto);
  }

  async findCustomerByDniAndType(queryParams: { dni?: string; type?: string }) {
    const query = { isDelete: false };
    for (const key in queryParams) {
      query[key] = queryParams[key];
    }
    const customer = await this.customersModule.findOne(query);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    return customer;
  }

  async findOneByProductNumber(productNumber: string) {
    const product = await this.customersModule.aggregate([
      { $match: { 'products.productNumber': productNumber, isDelete: false } },
      { $unwind: '$products' },
      { $match: { 'products.productNumber': productNumber } },
      { $project: { products: 1, dni: 1, name: 1, _id: 0 } },
    ]);
    if (!product.length) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }

  // async update(dni: string, updateCustomerDto: UpdateCustomerDto) {
  //   const updatedCustomer = await this.customersModule.findOneAndUpdate(
  //     { dni, isDelete: false },
  //     updateCustomerDto,
  //     { new: true },
  //   );
  //   if (!updatedCustomer) {
  //     throw new NotFoundException('Customer not found');
  //   }
  //   const customer = await this.customersModule
  //     .findOne({ dni: updateCustomerDto.dni })
  //     .select('dni');
  //   console.log(customer);
  //   if (customer.dni === dni) {
  //     throw new BadRequestException('');
  //   }
  //   return updatedCustomer;
  // }

  // async remove(dni: string) {
  //   const customer = await this.customersModule.findOne({
  //     dni,
  //     isDelete: false,
  //   });
  //   if (!customer) {
  //     throw new NotFoundException('Customer not found');
  //   }
  //   customer.isDelete = true;
  //   await this.customersModule.updateOne({ dni }, customer);
  //   return { message: 'Customer deleted' };
  // }
}
