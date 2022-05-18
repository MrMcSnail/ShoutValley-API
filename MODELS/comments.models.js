const db = require('../db/connection');

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
