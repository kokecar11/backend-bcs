import { Test, TestingModule } from '@nestjs/testing';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { getModelToken } from '@nestjs/mongoose';
import { CreateProductDto } from './dto/create-product.dto';
import { ProductType } from './schemas/products.schema';

describe('ProductsController', () => {
  let controller: ProductsController;
  let service: ProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ProductsController],
      providers: [
        ProductsService,
        {
          provide: getModelToken('Products'),
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
        {
          provide: getModelToken('Customers'),
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    controller = module.get<ProductsController>(ProductsController);
    service = module.get<ProductsService>(ProductsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should add a product', async () => {
    const productDto: CreateProductDto = {
      description: 'test',
      productNumber: '12345',
      type: ProductType.Credito,
      isDelete: false,
    };
    const dni = '12345678';
    const result = {
      id: '1',
      ...productDto,
    };

    jest.spyOn(service, 'addProduct').mockResolvedValue(result as any);
    expect(await controller.addProductCustomer(dni, productDto)).toEqual(
      result,
    );
  });

  it('should find all products', async () => {
    const result = [
      {
        id: '1',
        description: 'test',
        productNumber: '12345',
        type: ProductType.Credito,
        isDelete: false,
      },
    ];
    jest.spyOn(service, 'findAll').mockResolvedValue(result as any);
    expect(await controller.findAll()).toEqual(result);
  });

  it('should update a product', async () => {
    const productDto = {
      description: 'Test Description',
      type: ProductType.Credito,
    };
    const updatedProductDto = {
      description: 'Updated Test Description',
      type: ProductType.CDT,
    };
    const result = {
      id: '1',
      ...updatedProductDto,
    };

    jest.spyOn(service, 'update').mockResolvedValue(result as any);
    expect(await controller.update('1', productDto)).toEqual(result);
  });

  it('should soft delete a product', async () => {
    const productNumber = '1';
    jest
      .spyOn(service, 'remove')
      .mockResolvedValue({ message: 'Product deleted' });

    expect(await controller.remove(productNumber)).toEqual({
      message: 'Product deleted',
    });
  });
});
