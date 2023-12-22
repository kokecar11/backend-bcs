import { IsNotEmpty } from 'class-validator';
import { Products } from 'src/modules/products/schemas/products.schema';

export class CreateCustomerDto {
  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  dni: string;

  @IsNotEmpty()
  email: string;

  products: Products[];
}
