/* eslint-disable prefer-promise-reject-errors */
const {fetchArticleById, updateVotesByArticleID, fetchAllArticles} = require('../MODELS/articles.models');
const {fetchCommentCountByArticleID} = require('../MODELS/comments.models');

exports.getAllArticles = (req, res, next) => {
  return fetchAllArticles()
      .then((articles)=>{
        console.log('articles: ', articles);
        return res.status(200).send({articles});
      });
};

exports.getArticleByID = (req, res, next) => {
  const {article_id} = req.params;

  const promises = [
    fetchArticleById(article_id),
    fetchCommentCountByArticleID(article_id),
  ];

  return Promise.all(promises)
      .then(([article, comments])=>{
        article.comment_count = comments.count;
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
