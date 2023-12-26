import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ProductsService } from './products.service';
import { ProductType, ProductsDocument } from './schemas/products.schema';

describe('ProductsService', () => {
  let service: ProductsService;
  let model: Model<ProductsDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        {
          provide: getModelToken('Products'),
          useValue: {
            find: jest.fn().mockResolvedValue([]),
            findOne: jest.fn().mockResolvedValue({}),
            create: jest.fn().mockResolvedValue({}),
            updateOne: jest.fn().mockResolvedValue({}),
            findOneAndUpdate: jest.fn().mockResolvedValue({}),
          },
        },
        {
          provide: getModelToken('Customers'),
          useValue: {},
        },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    model = module.get<Model<ProductsDocument>>(getModelToken('Products'));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should get all products', async () => {
    await service.findAll();
    expect(model.find).toHaveBeenCalled();
  });

  it('should create a product', async () => {
    const productDto = {
      productNumber: '12345',
      isDelete: false,
      description: 'Test Description',
      type: ProductType.Credito,
    };
    await service.create(productDto);
    expect(model.create).toHaveBeenCalledWith(productDto);
  });

  it('should update a product', async () => {
    const productDto = {
      description: 'Test Description',
      type: ProductType.Credito,
    };
    await service.update('12345', productDto);
    expect(model.findOneAndUpdate).toHaveBeenCalled();
  });

  it('should delete a product', async () => {
    await service.remove('12345');
    expect(model.updateOne).toHaveBeenCalled();
  });
});
