import { BadRequestException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CustomersService } from './customers.service';
import { CustomerType, CustomersDocument } from './schemas/customer.schema';
import { ProductType } from '../products/schemas/products.schema';

describe('CustomersService', () => {
  let service: CustomersService;
  let model: Model<CustomersDocument>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CustomersService,
        {
          provide: getModelToken('Customers'),
          useValue: {
            create: jest.fn().mockResolvedValue({}),
            aggregate: jest.fn().mockResolvedValue({}),
            findOne: jest.fn().mockResolvedValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<CustomersService>(CustomersService);
    model = module.get<Model<CustomersDocument>>(getModelToken('Customers'));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should throw an error when customer already exists', async () => {
    const customer = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.empresa,
      email: 'test@test.com',
    };
    jest.spyOn(model, 'create').mockImplementation(() => {
      throw new BadRequestException('Customer already exists');
    });
    await expect(service.create(customer as any)).rejects.toThrow(
      new BadRequestException('Customer already exists'),
    );
  });

  it('should create a customer', async () => {
    const customerDto = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.empresa,
      email: 'test@test.com',
      products: [],
    };
    await service.create(customerDto);
    expect(model.create).toHaveBeenCalledWith(customerDto);
  });

  it('should throw an error when product is not found', async () => {
    const productNumber = '123';
    jest.spyOn(model, 'aggregate').mockResolvedValue([]);
    await expect(service.findOneByProductNumber(productNumber)).rejects.toThrow(
      new BadRequestException('Product not found'),
    );
  });

  it('should find product by product number', async () => {
    const productNumber = '123';
    const result = [
      {
        name: 'test',
        dni: '12345677',
        products: [{ productNumber, type: ProductType.CDT }],
      },
    ];
    jest.spyOn(model, 'aggregate').mockResolvedValue(result as any);
    expect(await service.findOneByProductNumber(productNumber)).toEqual(result);
  });

  it('should find customer by dni and type', async () => {
    await service.findCustomerByDniAndType({ dni: '12345679' });
    expect(model.findOne).toHaveBeenCalled();
  });
});
