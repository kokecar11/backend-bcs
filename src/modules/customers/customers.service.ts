import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
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
    return await this.customersModule.create(createCustomerDto);
  }

  async findCustomerByDniAndType(queryParams: { dni?: string; type?: string }) {
    const query = { isDelete: false };
    for (const key in queryParams) {
      query[key] = queryParams[key];
    }
    return await this.customersModule.findOne(query);
  }

  async findOneByProductNumber(productNumber: string) {
    return await this.customersModule.aggregate([
      { $match: { 'products.productNumber': productNumber, isDelete: false } },
      { $unwind: '$products' },
      { $match: { 'products.productNumber': productNumber } },
      { $project: { products: 1, dni: 1, name: 1, _id: 0 } },
    ]);
  }

  async update(dni: string, updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.customersModule.findOneAndUpdate(
      { dni, isDelete: false },
      updateCustomerDto,
      { new: true },
    );
    if (!updatedCustomer) {
      throw new NotFoundException('Customer not found');
    }
    return updatedCustomer;
  }

  async remove(dni: string) {
    const customer = await this.customersModule.findOne({
      dni,
      isDelete: false,
    });
    if (!customer) {
      throw new NotFoundException('Customer not found');
    }
    customer.isDelete = true;
    await this.customersModule.updateOne({ dni }, customer);
    return { message: 'Customer deleted' };
  }
}
