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
  test(`Status 404: should respond with a json object containing a 'message' key, containing 'Not Found'`, () => {
    request(app).get('/jibberish').expect(404).then(({body})=>{
      expect(body).toHaveProperty('message', 'Not Found');
    });
  });
});

describe('GET /api/topics', () => {
  test(`should respond with an array of topic objects, each of which should have the following properties: 'slug', 'description'`, () => {
    return request(app).get('/api/topics').expect(200).then(({body}) => {
      expect(body.topics).toBeInstanceOf(Array);
      if (body.topics.length > 0) {
        body.topics.forEach((topic)=> {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        });
      }
    });
  });
});
