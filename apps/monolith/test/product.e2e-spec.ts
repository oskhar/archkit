import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { TestHelper } from './test-helper';

describe('ProductController (e2e)', () => {
  let app: INestApplication;
  const testHelper = new TestHelper();

  beforeAll(async () => {
    app = await testHelper.createApplication();
  });

  afterAll(async () => {
    await testHelper.closeApplication();
  });

  beforeEach(async () => {
    await testHelper.cleanupDatabase();
  });

  it('should create a product (POST /products)', () => {
    return request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Test Product', price: 10.5 })
      .expect(201)
      .expect((res) => {
        expect(res.body.id).toBeDefined();
        expect(res.body.name).toEqual('Test Product');
        expect(res.body.price).toEqual(10.5);
      });
  });

  it('should get all products (GET /products)', async () => {
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Product 1', price: 10 });
    await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Product 2', price: 20 });

    return request(app.getHttpServer())
      .get('/products')
      .expect(200)
      .expect((res) => {
        expect(res.body.length).toEqual(2);
      });
  });

  it('should get a product by ID (GET /products/:id)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Single Product', price: 15 });
    const id = createRes.body.id;

    return request(app.getHttpServer())
      .get(`/products/${id}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.id).toEqual(id);
        expect(res.body.name).toEqual('Single Product');
      });
  });

  it('should update a product (PATCH /products/:id)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'Old Name', price: 15 });
    const id = createRes.body.id;

    return request(app.getHttpServer())
      .patch(`/products/${id}`)
      .send({ name: 'New Name' })
      .expect((res) => {
        if (res.status !== 200) {
          console.log('PATCH failed with:', JSON.stringify(res.body, null, 2));
        }
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.name).toEqual('New Name');
      });
  });

  it('should delete a product (DELETE /products/:id)', async () => {
    const createRes = await request(app.getHttpServer())
      .post('/products')
      .send({ name: 'To Delete', price: 15 });
    const id = createRes.body.id;

    await request(app.getHttpServer()).delete(`/products/${id}`).expect(200);

    return request(app.getHttpServer()).get(`/products/${id}`).expect(404);
  });
});
