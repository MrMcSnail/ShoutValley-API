const db = require('../db/connection');

exports.fetchArticleById = (article_id) => {
  return db
      .query(`
  SELECT * FROM articles 
  WHERE article_id=$1`, [article_id])
      .then(({rows})=>{
        if (!rows.length) {
          return Promise.reject({
            status: 400,
            msg: `${article_id} is an invalid Article ID.`,
          });
        }
        return rows[0];
      });
};
