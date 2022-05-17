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
        title: 'Does Mitch predate civilisation?',
        topic: 'mitch',
        author: 'icellusedkars',
        body: 'Archaeologists have uncovered a gigantic statue from the dawn of humanity, and it has an uncanny resemblance to Mitch. Surely I am not the only person who can see this?!',
        created_at: expect.any(String),
        votes: 0,
      };
      expect(body.article).toEqual(article);
    });
  });
  test('Status 400: responds with "Invalid Input" if article_id is not in the correct format', () => {
    return request(app).get('/api/articles/handbag').expect(400).then(({body})=>{
      console.log(body.msg);
      expect(body.msg).toEqual('Invalid input');
    });
  });
  test.todo('Status 400: responds with invalid article ID if ID is out of range of the DB');
});
