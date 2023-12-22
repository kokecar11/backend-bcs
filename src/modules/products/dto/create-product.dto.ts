import { IsNotEmpty } from 'class-validator';
import { ProductType } from '../schemas/products.schema';

export class CreateProductDto {
  @IsNotEmpty()
  productNumber: string;

  @IsNotEmpty()
  type: ProductType;

  @IsNotEmpty()
  description: string;

  isDelete: boolean;
}
