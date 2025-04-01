const supertest = require('supertest');
const createServer = require('../src/createServer');
const { tables, getKnex } = require('../src/data/index');

const data = {
  huisartsen: [
    {id: 1,
        voornaam: 'Tom',
        naam: 'Smolders',
        telefoonnummer: '09/37.73.94.7'
      },
      {id: 2,
        voornaam: 'Sven',
        naam: 'Gehesquire',
        telefoonnummer: '09/34.83.13.4'
      },
  ],
};

const dataToDelete = {
  huisartsen: [1, 2],
};

describe('Huisratsen', () => {
  let server;
  let request;
  let knex;

  beforeAll(async () => {
    server = await createServer();
    request = supertest(server.getApp().callback());
    knex = getKnex();
  });

  afterAll(async () => {
    await server.stop();
  });

  const url = '/api/huisartsen';

  describe('GET /api/huisartsen', () => {
    beforeAll(async () => {
      await knex(tables.huisarts).insert(data.huisartsen);
    });

    afterAll(async () => {
      await knex(tables.huisarts)
        .whereIn('id', dataToDelete.huisartsen)
        .delete();
    });

    it('should return 200 and all huisartsen', async () => {
      const response = await request.get(url);
      expect(response.status).toBe(200);
      expect(response.body.count).toBe(2);
      expect(response.body.items).toEqual(expect.arrayContaining(data.huisartsen));
    });

    it('should 400 when given an argument', async () => {
      const response = await request.get(`${url}?invalid=true`);
      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.query).toHaveProperty('invalid');
    });
  });

  describe('GET /api/huisartsen/:id', () => {

    beforeAll(async () => {
      await knex(tables.huisarts).insert(data.huisartsen[0]);
    });

    afterAll(async () => {
      await knex(tables.huisarts)
        .whereIn('id', dataToDelete.huisartsen)
        .delete();
    });

    it('should 200 and return the requested huisarts', async () => {
      const response = await request.get(`${url}/1`);
      console.log(response.body);
      expect(response.statusCode).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        voornaam: 'Tom',
        naam: 'Smolders',
        telefoonnummer: '09/37.73.94.7'
      });
    });
    it('should 404 when requesting niet bestaande huisarts', async () => {
      const response = await request.get(`${url}/2`);

      expect(response.statusCode).toBe(404);
      expect(response.body).toMatchObject({
        code: 'NOT_FOUND',
        message: 'Huisarts met id 2 bestaat niet',
      });
      expect(response.body.stack).toBeTruthy();
    });

    it('should 400 with invalid huisarts id', async () => {
      const response = await request.get(`${url}/invalid`);

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.params).toHaveProperty('id');
    });
  });


  describe('POST /api/huisartsen', () => {

    const huisartsenToDelete = [];

    afterAll(async () => {
      await knex(tables.huisarts)
        .whereIn('id', huisartsenToDelete)
        .delete();
    });

    it('should 201 and return de aangemaakte huisarts', async () => {
      const response = await request.post(url)
        .send({
          naam: "D'hooge",
          voornaam: 'Erik',
          telefoonnummer: '09/37.75.57.8'
        });
      expect(response.statusCode).toBe(201);
      expect(response.body.id).toBeTruthy();
      expect(response.body.naam).toBe("D'hooge");
      expect(response.body.voornaam).toBe("Erik");
      expect(response.body.telefoonnummer).toBe('09/37.75.57.8');

      huisartsenToDelete.push(response.body.id);
    });

    it('should 400 wanneer naam ontbreekt', async () => {
      const response = await request.post(url)
        .send({
          voornaam: 'Erik',
          telefoonnummer: '09/37.75.57.8'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('naam');
    });

    it('should 400 wanneer voornaam ontbreekt', async () => {
      const response = await request.post(url)
        .send({
          naam: "D'hooge",
          telefoonnummer: '09/37.75.57.8'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('voornaam');
    });

    it('should 400 wanneer telefoonnummer niet van juiste formaat is', async () => {
      const response = await request.post(url)
        .send({
          naam: "D'hooge",
          voornaam: 'Erik',
          telefoonnummer: '80000'
        });

      expect(response.statusCode).toBe(400);
      expect(response.body.code).toBe('VALIDATION_FAILED');
      expect(response.body.details.body).toHaveProperty('telefoonnummer');
    });


  });

  describe('DELETE /api/huisartsen/1', () => {

    beforeAll(async () => {
      await knex(tables.huisarts).insert(data.huisartsen[0]);
    });

    it('should 204 and return nothing', async () => {
      const response = await request.delete(`${url}/1`);
      expect(response.statusCode).toBe(204);
      expect(response.body).toEqual({});
    });
  });

})
