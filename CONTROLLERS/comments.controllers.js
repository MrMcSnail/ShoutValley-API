const {fetchCommentsByArticleID, insertCommentAboutArticle, deleteCommentByCommentID} = require('../MODELS/comments.models');

exports.getCommentsByArticleID = (req, res, next) => {
  const {article_id} = req.params;
  return fetchCommentsByArticleID(article_id)
      .then((comments)=> {
        res.status(200).send({comments});
      }).catch(next);
};

exports.removeCommentsByCommentID = (req, res, next) => {
  const {comment_id} = req.params;
  return deleteCommentByCommentID(comment_id).then(()=> {
    res.status(204).send({});
  }).catch(next);
};

exports.postCommentToArticle = (req, res, next) => {
  const {article_id} = req.params;
  const {username, body} = req.body;
  return insertCommentAboutArticle(article_id, username, body).then((comment)=>{
    res.status(201).send({comment});
  }).catch(next);
};
