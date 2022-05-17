const express = require('express');
const app = express();
const {getTopics} = require('./CONTROLLERS/topics.controllers');
const {getArticleByID} = require('./CONTROLLERS/articles.controllers');
const {handleCustomErrors, handlePsqlErrors, handleServerErrors,
} = require('./CONTROLLERS/errors.controllers');

app.get('/api/topics', getTopics);
app.get('/api/articles/:article_id', getArticleByID);

app.get('/api/users', getUsers);

app.all('/*', (req, res) => {
  res.status(404).send({message: 'Not Found'});
});

app.use(handlePsqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
