/* eslint-disable prefer-promise-reject-errors */
const {fetchTopics} = require('../MODELS/topics.models');

exports.getTopics = (req, res, next) => {
  return fetchTopics().then((topics) => {
    res.status(200).send({topics});
  }).catch(next);
};
