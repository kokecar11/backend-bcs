import { IsNotEmpty } from 'class-validator';
import { Products } from 'src/modules/products/schemas/products.schema';
import { CustomerType } from '../schemas/customer.schema';

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dni: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  type: CustomerType;

  products: Products[];
}
