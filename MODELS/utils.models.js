const db = require('../db/connection');

exports.articleIDExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
    return rows.length? true : false;
  });
};

exports.topicExists = (topic) => {
  return db.query(`SELECT * FROM topics WHERE slug = $1`, [topic]).then(({rows})=>{
    return rows.length? true : false;
  });
};
