import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductsDocument = Products & Document;

@Schema()
export class Products {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  //   @Prop({ required: true })
  //   interestRate: number;

  //   @Prop({ required: true })
  //   minimumBalance: number;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
