const express = require('express');
const app = express();
const {getTopics} = require('./CONTROLLERS/news.controllers');


app.get('/api/topics', getTopics);

app.all('/*', (req, res) => {
  res.status(404).send({message: 'Not Found'});
});

app.use((err, request, response, next) => {
  res.status(500).send({msg: 'Internal Server Error'});
});

module.exports = app;
