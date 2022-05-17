/* eslint-disable prefer-promise-reject-errors */
const {fetchArticleById} = require('../MODELS/articles.models');

exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params;
  return fetchArticleById(article_id)
      .then((article)=>{
        return res.status(200).send({article});
      })
      .catch((err) =>{
        console.log('err: ', err);
        next(err);
      });
};

