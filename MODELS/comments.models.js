const db = require('../db/connection');
const {articleIDExists} = require('./utils.models');

exports.fetchCommentsByArticleID = (article_id) => {
  return articleIDExists(article_id)
      .then((id_exists)=>{
        if (id_exists) {
          return db.query(`SELECT * 
          FROM comments 
          WHERE article_id = $1`,
          [article_id]);
        } else {
          return Promise.reject({
            status: 404,
            msg: `Article with ID:${article_id} is not found.`,
          });
        }
      }).then(({rows})=>{
        return rows;
      });
};

exports.fetchCommentCountByArticleID = (article_id) => {
  return db
      .query(`
      SELECT COUNT (*)
      FROM comments 
      WHERE article_id = $1;
  `, [article_id]).then(({rows})=>{
        return rows[0];
      });
};

exports.deleteCommentByCommentID = (comment_id) => {
  return db.query(`
  DELETE FROM comments
  WHERE comment_id = $1;`,
  [comment_id]);

exports.insertCommentAboutArticle = (article_id, username, body) => {
  return articleIDExists(article_id)
      .then((id_exists)=>{
        if (id_exists) {
          return db.query(`
          INSERT INTO comments 
          (body, article_id, author) 
          VALUES ($1, $2, $3)
          RETURNING *;`,
          [body, article_id, username]).then(({rows})=>{
            return rows[0];
          });
        } else {
          return Promise.reject({
            status: 404,
            msg: `Article with ID:${article_id} is not found.`,
          });
        }
      });
};
