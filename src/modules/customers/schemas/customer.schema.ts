import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Products } from 'src/modules/products/schemas/products.schema';

export type CustomersDocument = Customers & Document;

@Schema()
export class Customers {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'Product' }] })
  products: Products[];
}

export const CustomersSchema = SchemaFactory.createForClass(Customers);
