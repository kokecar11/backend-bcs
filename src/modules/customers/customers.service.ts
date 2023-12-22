import { Injectable } from '@nestjs/common';
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

  async findAll() {
    return await this.customersModule.find({ isDelete: false });
  }

  async findOne(id: string) {
    return await this.customersModule.findById(id, { isDelete: false });
  }

  async update(id: string, updateCustomerDto: UpdateCustomerDto) {
    const updatedCustomer = await this.customersModule.findByIdAndUpdate(
      id,
      updateCustomerDto,
      { new: true },
    );
    if (!updatedCustomer) {
      throw new Error('Customer not found');
    }
    return updatedCustomer;
  }

  async remove(id: string) {
    const customer = await this.customersModule.findById(id);
    if (!customer) {
      throw new Error('Customer not found');
    }
    customer.isDelete = true;
    await this.customersModule.updateOne({ _id: id }, customer);
    return customer;
  }
}
