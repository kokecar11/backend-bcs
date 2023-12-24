import { Injectable, NotFoundException } from '@nestjs/common';
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

  async findAll() {
    return await this.productsModule.find({ isDelete: false });
  }

  async addProduct(customerDni: string, createProductDto: CreateProductDto) {
    const newProduct = new this.productsModule(createProductDto);
    newProduct.save();
    const customer = await this.customersModule.findOne({ dni: customerDni });
    customer.products.push(newProduct);
    return await this.customersModule.updateOne({ dni: customerDni }, customer);
  }

  async update(productNumber: string, updateProductDto: UpdateProductDto) {
    const updatedProduct = await this.productsModule.findOneAndUpdate(
      { productNumber, isDelete: false },
      updateProductDto,
      { new: true },
    );
    if (!updatedProduct) {
      throw new NotFoundException('Product not found');
    }
    return { message: 'Product updated', product: updatedProduct };
  }

  async remove(productNumber: string) {
    const product = await this.productsModule.findOne({
      productNumber,
      isDelete: false,
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    product.isDelete = true;
    await this.productsModule.updateOne({ productNumber }, product);
    return { message: 'Product deleted' };
  }
}
