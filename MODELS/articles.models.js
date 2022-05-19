const db = require('../db/connection');
const format = require('pg-format');
const {columnValidate} = require('./utils.models');

exports.fetchAllArticles = (sort_by = 'created_at', order = 'DESC') => {
  // sanitise column name (sort_by)
  return columnValidate(sort_by).then((columnExists) => {
    if (columnExists) {
      // sanitise SQL command (order)
      const orderValidate = /(^desc$|^asc$)/gi;
      if (orderValidate.test(order)) {
        // construct query
        const queryStart = format(
            `SELECT articles.*,
        COUNT(comments.article_id) as "comment_count"
        FROM articles
        LEFT JOIN comments 
        ON comments.article_id = articles.article_id
        GROUP BY articles.article_id
        ORDER BY %I`,
            sort_by,
        );
        const queryString = queryStart.concat(' ', order, ' ', ';');
        // make query
        return db.query(queryString).then(({rows}) => {
          return rows;
        });
      } else {
        // error on 'order' query
        return Promise.reject({
          status: 400,
          msg: `Order must be 'ASC' or 'DESC'.`,
        });
      }
    } else {
      // error on column (sort_by) query
      return Promise.reject({
        status: 404,
        msg: `Invalid Sort Parameter`,
      });
    }
  });
};

exports.fetchArticleById = (article_id) => {
  return db
      .query(
          `
  SELECT 
  articles.*,
  COUNT(comments.article_id) as "comment_count"
  FROM articles
  LEFT JOIN comments 
  ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1
  GROUP BY articles.article_id;`,
          [article_id],
      )
      .then(({rows}) => {
        return rows[0];
      });
};

exports.updateVotesByArticleID = (inc_votes, article_id) => {
  if (!inc_votes) {
    return Promise.reject({
      status: 400,
      msg: 'Bad Request',
    });
  }

  return db
      .query(
          `
UPDATE articles 
SET 
votes = VOTES + $1
WHERE article_id = $2
RETURNING *;`,
          [inc_votes, article_id],
      )
      .then(({rows}) => {
        return rows[0];
      });
};
