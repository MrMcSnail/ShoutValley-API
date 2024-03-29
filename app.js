const express = require('express');
const app = express();
const {getCommentsByArticleID, postCommentToArticle, removeCommentsByCommentID} = require('./CONTROLLERS/comments.controllers');
const {getTopics} = require('./CONTROLLERS/topics.controllers');
const {getArticleByID, patchVotesByArticleID, getAllArticles} = require('./CONTROLLERS/articles.controllers');
const {getAllUsers} = require('./CONTROLLERS/users.controllers');
const {handleCustomErrors, handlePsqlErrors, handleServerErrors,
} = require('./CONTROLLERS/errors.controllers');
const endpointMap = require('./endpoints.json');

app.use(express.json());

app.get('/api', (req, res, next)=> {
  res.status(200).send({endpointMap});
});
app.get('/api/topics', getTopics);
app.get('/api/articles', getAllArticles);
app.get('/api/articles/:article_id', getArticleByID);
app.get('/api/articles/:article_id/comments', getCommentsByArticleID);
app.patch('/api/articles/:article_id', patchVotesByArticleID);

app.get('/api/users', getAllUsers);

app.delete('/api/comments/:comment_id', removeCommentsByCommentID);

app.get('/api/articles/:article_id/comments', getCommentsByArticleID);
app.post('/api/articles/:article_id/comments', postCommentToArticle);

app.all('/*', (req, res) => {
  res.status(404).send({message: 'Not Found'});
});
app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
