/* eslint-disable prefer-promise-reject-errors */
const {fetchArticleById, updateVotesByArticleID} = require('../MODELS/articles.models');

exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params;
  return fetchArticleById(article_id)
      .then((article)=>{
        return res.status(200).send({article});
      })
      .catch(next);
};

exports.patchVotesByArticleID = (req, res, next) => {
  const {inc_votes} = req.body;
  const {article_id} = req.params;

  return updateVotesByArticleID(inc_votes, article_id)
      .then((updatedArticle)=> {
        return res.status(201).send({updatedArticle});
      })
      .catch((err)=> {
        console.log('err: ', err);
        next(err);
      },
      );
};
