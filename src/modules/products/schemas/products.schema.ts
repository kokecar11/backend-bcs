import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type ProductsDocument = Products & Document;

export enum ProductType {
  CDT = 'CDT',
  CuentaAhorros = 'Cuenta de Ahorros',
  CuentaCorriente = 'Cuenta Corriente',
  Credito = 'Crédito',
}

@Schema()
export class Products {
  @Prop({ required: true, unique: true })
  productNumber: string;

  @Prop({ required: true, enum: ProductType })
  type: ProductType;

  @Prop({ required: true })
  description: string;

  @Prop({ default: false })
  isDelete: boolean;
}

export const ProductsSchema = SchemaFactory.createForClass(Products);
