const request = require('supertest');
const seed = require('../db/seeds/seed');
const testData = require('../db/data/test-data');
const db = require('../db/connection');
const app = require('../app');

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe('GET /not-a-route', () => {
  test(`Status 404: should respond with a json object containing a 'message' key, constaining 'Not Found'`, () => {
    request(app).get('/jibberish').expect(404).then((res)=>{
      const {body} = res;
      expect(body).toHaveProperty('message');
      expect(body.message).toEqual('Not Found');
    });
  });
});

describe('GET /api/topics', () => {
  test(`should respond with an array of topic objects, each of which should have the following properties: 'slug', 'description'`, () => {
    return request(app).get('/api/topics').expect(200).then(({body}) => {
      expect(body).toBeInstanceOf(Array);
      body.forEach((topic)=> {
        expect(topic).toHaveProperty('slug');
        expect(topic).toHaveProperty('description');
      });
    });
  });
});
