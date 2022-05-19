const request = require('supertest');
require('jest-sorted');
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

describe('GET /api/articles', ()=> {
  test('Status 200: should respond with an `articles` array of article objects, each article object should have the correct properties the articles should be sorted by date in descending order.', () => {
    return request(app)
        .get('/api/articles')
        .expect(200)
        .then(({body}) => {
          const articles = body.articles;
          const exampleArticle = {
            article_id: expect.any(Number),
            title: expect.any(String),
            topic: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            comment_count: expect.any(String),
          };
          if (articles.length) {
            articles.forEach((article)=>{
              expect(article).toMatchObject(exampleArticle);
            });
          }
          expect(articles).toBeSortedBy('created_at', {descending: true});
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
  test(`Status 200: An article response object should also now include: 'comment_count' which is the total count of all the comments with this article_id`, ()=>{
    return request(app).get('/api/articles/3').expect(200).then(({body})=>{
      expect(body.article).toHaveProperty('comment_count', '2');
    });
  });
  test('Status 400: responds with "Invalid Input" if article_id is not in the correct format', () => {
    return request(app).get('/api/articles/handbag').expect(400).then(({body})=>{
      expect(body.msg).toBe('Invalid Input');
    });
  });
  test('Status 404: responds with invalid article ID if ID is out of range of the DB', () => {
    return request(app).get('/api/articles/9999').expect(404).then(({body})=>{
      expect(body.msg).toEqual('9999 is an invalid Article ID.');
    });
  });
});

describe('PATCH /api/articles/:article_id', () => {
  test('Status 200: Request body accepts an object in the form `{ inc_votes: newVote }`, updates the DB and then responds with the updated article', () => {
    const article = {
      article_id: 1,
      title: expect.any(String),
      topic: expect.any(String),
      author: expect.any(String),
      body: expect.any(String),
      created_at: expect.any(String),
      votes: 223,
    };
    const requestBody = {inc_votes: 123};

    return request(app).patch('/api/articles/1').send(requestBody).expect(200).then(({body})=> {
      expect(body).toEqual(expect.objectContaining({article}));
    });
  });
  test('Should work for both positive and negative numbers of votes', ()=> {
    const requestBody = {inc_votes: - 50};
    return request(app).patch('/api/articles/1').send(requestBody).expect(200).then(({body})=>{
      const votes = body.article.votes;
      expect(votes).toBe(50);
    });
  });
  test('Should work when the decriment makes the value of `votes` negative', ()=> {
    const requestBody = {inc_votes: - 150};
    return request(app).patch('/api/articles/1').send(requestBody).expect(200).then(({body})=>{
      const votes = body.article.votes;
      expect(votes).toBe(-50);
    });
  });
  test('Status 400: responds with "Bad Request" when there is no `inc_votes` on the request body', ()=> {
    const requestBody = {handbag: 101};
    return request(app).patch('/api/articles/2').send(requestBody).expect(400).then(({body})=>{
      expect(body.msg).toBe('Bad Request');
    });
  });
  test('Status 400: responds with "Invalid Input" when ``inc_votes`` is an invalid format)', ()=> {
    const requestBody = {inc_votes: 'handbag'};
    return request(app).patch('/api/articles/3').send(requestBody).expect(400).then(({body})=>{
      expect(body.msg).toBe('Invalid Input');
    });
  });
});

describe('GET /api/users', ()=>{
  test(`Status 200: Responds with an array of objects, each object should have the following property:
username`, () => {
    return request(app).get('/api/users').expect(200).then(({body})=>{
      expect(body.users).toBeInstanceOf(Array);
      if (body.users.length !== 0) {
        body.users.forEach((user)=>{
          expect(user).toHaveProperty('username');
        });
      }
    });
  });
});

describe('GET /api/articles/:article_id/comments', () => {
  test(`Status 200: Responds with an array of comments for the given "article_id" of which each comment should have the correct properties`, () => {
    const comment = {
      comment_id: expect.any(Number),
      body: expect.any(String),
      article_id: 3,
      author: expect.any(String),
      votes: expect.any(Number),
      created_at: expect.any(String),
    };
    return request(app).get('/api/articles/3/comments').expect(200).then(({body})=>{
      expect(body.comments).toBeInstanceOf(Array);
      expect(body.comments[0]).toEqual(expect.objectContaining(comment));
    });
  });
  test('Should return an empty array if there are no comments', ()=>{
    return request(app).get('/api/articles/2/comments').expect(200).then(({body})=>{
      expect(body.comments).toBeInstanceOf(Array);
      expect(body.comments.length).toBe(0);
    });
  });
  test('Status 404: should respond with "Not Found" when an incorrect article id is passed', () => {
    return request(app).get('/api/articles/9999/comments').expect(404).then(({body}) => {
      expect(body.msg).toBe('9999 is an invalid Article ID.');
    });
  });
  test('Status 400: should respond with "Invalid Input" when given an article_id in an invalid format', ()=>{
    return request(app).get('/api/articles/nasty/comments').expect(400).then(({body})=>{
      expect(body.msg).toBe('Invalid Input');
    });
  });
});
