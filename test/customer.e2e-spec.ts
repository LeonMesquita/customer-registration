import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { mockedCustomerDto } from 'src/utils/mocks.util';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (POST) should create a new customer', async () => {
    return request(app.getHttpServer())
      .post('/customer')
      .send(mockedCustomerDto)
      .expect(201);
  });

  it('/ (POST) should throw enprocessable entity if the CPF is incorrect', async () => {
    return request(app.getHttpServer())
      .post('/customer')
      .send({
        ...mockedCustomerDto,
        cpf: '111.444.777-05',
      })
      .expect(422);
  });

  it('/ (POST) should throw conflict exception if the CPF already exists', async () => {
    return request(app.getHttpServer())
      .post('/customer')
      .send(mockedCustomerDto)
      .expect(409);
  });

  it('/ (GET) should return a customer by CPF', async () => {
    return request(app.getHttpServer())
      .get(`/customer/${mockedCustomerDto.cpf}`)
      .expect(200)
      .then((response) => {
        const customer = response.body;
        expect(customer).toBeInstanceOf(Object);
      });
  });

  it('/ (GET) should throw not found exception if the customer was not found', async () => {
    return request(app.getHttpServer())
      .get(`/customer/00000000000`)
      .expect(404);
  });

  it('/ (GET) should return a list of custumers', async () => {
    return request(app.getHttpServer())
      .get(`/customer`)
      .expect(200)
      .then((response) => {
        const customers = response.body;
        expect(Array.isArray(customers)).toBe(true);
      });
  });
});
