const db = require('../db/connection');

exports.articleIDExists = (article_id) => {
  return db.query(`SELECT * FROM articles WHERE article_id = $1`, [article_id]).then(({rows})=>{
    return rows.length? true : false;
  });
};

exports.fetchAllArticles = () => {
  return db.query(`SELECT 
  articles.*,
  COUNT(comments.article_id) as "comment_count"
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id
  GROUP BY articles.article_id
  ORDER BY created_at DESC
  ;`).then(({rows})=>{
    return rows;
  });
};

exports.fetchArticleById = (article_id) => {
  return db
      .query(`
  SELECT * FROM articles 
  WHERE article_id=$1`, [article_id])
      .then(({rows})=>{
        if (!rows.length) {
          return Promise.reject({
            status: 404,
            msg: `${article_id} is an invalid Article ID.`,
          });
        }
        return rows[0];
      });
};

exports.updateVotesByArticleID = (inc_votes, article_id) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  };

  return db
      .query(`
UPDATE articles 
SET 
votes = VOTES + $1
WHERE article_id = $2
RETURNING *;`, [inc_votes, article_id])
      .then(({rows})=> {
        return rows[0];
      });
};
