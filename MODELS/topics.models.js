const db = require('../db/connection');
const {topicExists} = require('./utils.models');

exports.fetchTopics = () => {
  return db
      .query('SELECT * FROM topics;')
      .then(({rows}) => {
        return rows;
      });
};

exports.filterByTopicIfExists = (topic, rows) => {
  return topicExists(topic).then((itExists)=>{
    if (itExists) {
      return rows.filter((article) => article.topic === topic);
    } else {
      return Promise.reject({
        status: 404,
        msg: `Topic not found`,
      });
    }
  });
};
