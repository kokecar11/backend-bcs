import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { getModelToken } from '@nestjs/mongoose';
import { CustomersController } from './customers.controller';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { CustomerType } from './schemas/customer.schema';
import { ProductType } from '../products/schemas/products.schema';

describe('CustomersController', () => {
  let controller: CustomersController;
  let service: CustomersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomersController],
      providers: [
        CustomersService,
        {
          provide: getModelToken('Customers'),
          useValue: { create: jest.fn().mockResolvedValue({}) },
        },
      ],
    }).compile();

    controller = module.get<CustomersController>(CustomersController);
    service = module.get<CustomersService>(CustomersService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a customer', async () => {
    const dto: CreateCustomerDto = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.personal,
      email: 'test@test.com',
      products: [],
    };
    const result = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.personal,
      email: 'test@test.com',
      products: [],
    };
    jest.spyOn(service, 'create').mockResolvedValue(result as any);
    expect(await controller.create(dto)).toBe(result);
  });

  it('should throw an error when the customer already exists', async () => {
    const dto: CreateCustomerDto = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.personal,
      email: 'test@test.com',
      products: [],
    };
    jest.spyOn(service, 'create').mockImplementation(() => {
      throw new BadRequestException('Customer already exists');
    });

    try {
      await controller.create(dto);
    } catch (e) {
      expect(e.message).toBe('Customer already exists');
    }
  });

  it('should find a customer by dni and type', async () => {
    const result = {
      name: 'test',
      dni: '12345677',
      type: CustomerType.personal,
      email: 'test@test.com',
      products: [],
    };
    jest
      .spyOn(service, 'findCustomerByDniAndType')
      .mockResolvedValue(result as any);
    expect(
      await controller.findAll({ dni: '12345677', type: 'personal' }),
    ).toBe(result);
  });

  it('should throw an error when the customer with dni & type is not found', async () => {
    jest.spyOn(service, 'findCustomerByDniAndType').mockImplementation(() => {
      throw new BadRequestException('Customer not found');
    });

    try {
      await controller.findAll({ dni: '12345677', type: 'personal' });
    } catch (e) {
      expect(e.message).toBe('Customer not found');
    }
  });

  it('should find a customer by productNumber', async () => {
    const result = [
      {
        name: 'test',
        dni: '12345677',
        products: [
          {
            productNumber: '123456',
            description: 'test description',
            type: ProductType.CDT,
            isDelete: false,
          },
        ],
      },
    ];
    jest
      .spyOn(service, 'findOneByProductNumber')
      .mockResolvedValue(result as any);
    expect(await controller.findOneByProductNumber('123456')).toBe(result);
  });
});
