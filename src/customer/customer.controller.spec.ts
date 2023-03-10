import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { CPFValidator } from 'src/utils/cpf-validator.util';
import {
  customersList,
  mockedCustomer,
  mockedCustomerDto,
} from 'src/utils/mocks.util';
import { CustomerController } from './customer.controller';
import { CustomerService } from './customer.service';

describe('CustomerController', () => {
  let controller: CustomerController;
  let service: CustomerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CustomerController],
      providers: [
        {
          provide: CustomerService,
          useValue: {
            create: jest.fn().mockResolvedValue(mockedCustomer),
            findAll: jest.fn().mockResolvedValue(customersList),
            findByCPF: jest.fn().mockResolvedValue(mockedCustomer),
          },
        },
        {
          provide: CPFValidator,
          useValue: {
            validate: jest.fn().mockResolvedValue(true),
          },
        },
      ],
    }).compile();

    controller = module.get<CustomerController>(CustomerController);
    service = module.get<CustomerService>(CustomerService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should return the created customer', async () => {
      const response = await controller.create(mockedCustomerDto);
      expect(response).toEqual(mockedCustomer);
    });

    it('should throw conflict exception on create', async () => {
      jest
        .spyOn(service, 'create')
        .mockRejectedValueOnce(new ConflictException());
      expect(controller.create(mockedCustomerDto)).rejects.toThrowError(
        'Conflict',
      );
    });
  });

  describe('findByCPF', () => {
    it('should return a customer by CPF', async () => {
      const response = await controller.findByCPF('');
      expect(response).toEqual(mockedCustomer);
    });

    it('should throw not found exception on findByCPF', async () => {
      jest
        .spyOn(service, 'findByCPF')
        .mockRejectedValueOnce(new NotFoundException());
      expect(controller.findByCPF('')).rejects.toThrowError('Not Found');
    });
  });

  describe('findAll', () => {
    it('should return a list of customers', async () => {
      const response = await controller.findAll();
      expect(response).toEqual(customersList);
    });
  });
});
