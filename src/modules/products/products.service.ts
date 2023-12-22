import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Products, ProductsDocument } from './schemas/products.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  Customers,
  CustomersDocument,
} from '../customers/schemas/customer.schema';

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Products.name)
    private productsModule: Model<ProductsDocument>,
    @InjectModel(Customers.name)
    private customersModule: Model<CustomersDocument>,
  ) {}
  async create(createProductDto: CreateProductDto) {
    return await this.productsModule.create(createProductDto);
  }

  async addProduct(customerId: string, createProductDto: CreateProductDto) {
    const newProduct = new this.productsModule(createProductDto);
    const customer = await this.customersModule.findById({ _id: customerId });
    customer.products.push(newProduct);
    return await this.customersModule.updateOne({ _id: customerId }, customer);

    // return await this.productsModule.create(createProductDto);
  }

  async findAll() {
    return await this.productsModule.find({ isDelete: false });
  }

  async findOne(id: string) {
    return await this.productsModule.findById(id, { isDelete: false });
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productsModule.findByIdAndUpdate(
      id,
      updateProductDto,
      { new: true },
    );
    if (!updatedProduct) {
      throw new Error('Product not found');
    }
    return updatedProduct;
  }

  async remove(id: string) {
    const product = await this.productsModule.findById(id);
    if (!product) {
      throw new Error('Product not found');
    }
    product.isDelete = true;
    await this.productsModule.updateOne({ _id: id }, product);
    return product;
  }
}
