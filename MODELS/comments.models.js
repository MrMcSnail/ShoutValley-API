const db = require('../db/connection');

exports.fetchCommentsByArticleID = (article_id) => {
  return db.query(`SELECT * 
      FROM comments 
      WHERE article_id = $1`, [article_id]).then(({rows})=>{
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
