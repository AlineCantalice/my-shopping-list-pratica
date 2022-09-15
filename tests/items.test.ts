import supertest from "supertest";
import app from "../src/app";
import { prisma } from "../src/database";
import {createId, createItems} from "./factories/itemsFactory";

beforeEach(async () => {
  await prisma.$executeRaw`TRUNCATE TABLE items;`;
});

describe('Testa POST /items ', () => {

  it('Deve retornar 201, se cadastrado um item no formato correto', async () => {
    const body = createItems();

    const result = await supertest(app).post('/items').send(body);

    expect(result.status).toBe(201);
  });

  it('Deve retornar 409, ao tentar cadastrar um item que exista', async () => {
    const body = createItems();

    await supertest(app).post('/items').send(body);
    const result = await supertest(app).post('/items').send(body);

    expect(result.status).toBe(409);
  });

});

describe('Testa GET /items ', () => {

  it('Deve retornar status 200 e o body no formato de Array',async () => {
    const body = createItems();

    await supertest(app).post('/items').send(body);

    const result = await supertest(app).get('/items').send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Array);
  });

});

describe('Testa GET /items/:id ', () => {
  it('Deve retornar status 200 e um objeto igual a o item cadastrado', async () => {
    const body = createItems();

    const item = await supertest(app).post('/items').send(body);

    const result = await supertest(app).get(`/items/${item.body.id}`).send();

    expect(result.status).toBe(200);
    expect(result.body).toBeInstanceOf(Object);
  });

  it('Deve retornar status 404 caso não exista um item com esse id', async () => {
    const id = createId();

    const result = await supertest(app).get(`/items/${id}`).send();

    expect(result.status).toBe(404);
  });
});

afterAll(async () => {
  await prisma.$disconnect();
});
