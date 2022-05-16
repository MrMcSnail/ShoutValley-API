const {fetchTopics} = require('../MODELS/news.models');

exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    res.status(200).send({topics});
  }).catch(next);
};
