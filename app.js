const express = require('express');
const app = express();
const {getTopics} = require('./CONTROLLERS/topics.controllers');
const {getArticleByID, patchVotesByArticleID} = require('./CONTROLLERS/articles.controllers');
const {handleCustomErrors, handlePsqlErrors, handleServerErrors,
} = require('./CONTROLLERS/errors.controllers');
app.use(express.json());

app.get('/api/topics', getTopics);

app.get('/api/articles/:article_id', getArticleByID);
app.patch('/api/articles/:article_id', patchVotesByArticleID);

app.get('/api/users', getUsers);

app.all('/*', (req, res) => {
  res.status(404).send({message: 'Not Found'});
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
