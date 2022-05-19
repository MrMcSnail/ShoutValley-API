const { fetchCommentsByArticleID } = require('../MODELS/comments.models');

exports.getCommentsByArticleID = (req, res, next) => {
  const {article_id} = req.params;
  return fetchCommentsByArticleID(article_id)
  .then((comments)=> {
    res.status(200).send({comments});
  }).catch(next);
}