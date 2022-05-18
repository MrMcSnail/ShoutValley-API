/* eslint-disable prefer-promise-reject-errors */
const {fetchArticleById, updateVotesByArticleID, fetchAllArticles} = require('../MODELS/articles.models');

exports.getAllArticles = (req, res, next) => {
  return fetchAllArticles()
      .then((articles)=>{
        console.log('articles: ', articles);
        return res.status(200).send({articles});
      });
};

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
      .then((article)=> {
        return res.status(200).send({article});
      })
      .catch((next));
};

