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

describe('GET /api/articles/:article_id', () => {
  test('Status 200: Responds with an article from the DB based on the id parameter in the request', () => {
    return request(app).get('/api/articles/8').expect(200).then(({body})=>{
      const article = {
        article_id: 8,
        title: expect.any(String),
        topic: expect.any(String),
        author: expect.any(String),
        body: expect.any(String),
        created_at: expect.any(String),
        votes: expect.any(Number),
      };
      expect(body.article).toEqual(expect.objectContaining(article));
    });
  });
  test('Status 400: responds with "Invalid Input" if article_id is not in the correct format', () => {
    return request(app).get('/api/articles/handbag').expect(400).then(({body})=>{
      expect(body.msg).toBe('Invalid input');
    });
  });
  test('Status 404: responds with invalid article ID if ID is out of range of the DB', () => {
    return request(app).get('/api/articles/9999').expect(404).then(({body})=>{
      expect(body.msg).toEqual('9999 is an invalid Article ID.');
    });
  });
});

describe('GET /api/users', () => {
  test('Status 200: Responds with an array of objects, each object should have the following property:`username`', () => {
    return request(app).get('/api/users').expect(200).then(({body})=> {
      expect(body).toBeInstanceOf(Array);
      body.forEach((object) => {
        expect(object).toHaveProperty('username');
      });
    });
  });
});
