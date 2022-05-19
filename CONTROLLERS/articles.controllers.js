const {fetchArticleById, updateVotesByArticleID, fetchAllArticles} = require('../MODELS/articles.models');
const {articleIDExists} = require('../MODELS/utils.models');

exports.getAllArticles = (req, res, next) => {
  const {sort_by, order} = req.query;
  return fetchAllArticles(sort_by, order)
      .then((articles)=>{
        return res.status(200).send({articles});
      }).catch(next);
};

exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params;
  return articleIDExists(article_id)
      .then((articleExists)=>{
        if (articleExists) {
          return fetchArticleById(article_id);
        } else {
          return Promise.reject({
            status: 404,
            msg: `${article_id} is an invalid Article ID.`,
          });
        }
      }).then((article)=>{
        res.status(200).send({article});
      }).catch(next);
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
