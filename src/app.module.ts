import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
// import { Customer, CustomerDocument } from './schemas/customer.schema';
// import { Product, ProductDocument } from './schemas/product.schema';
import { ProductsModule } from './modules/products/products.module';
import { CustomersModule } from './modules/customers/customers.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/bcs'),
    ProductsModule,
    CustomersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
