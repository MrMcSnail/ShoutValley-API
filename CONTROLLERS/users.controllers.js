const {fetchAllUsers} = require('../MODELS/users.models');

exports.getAllUsers = (req, res, next) => {
  return fetchAllUsers().then((users) => {
    res.status(200).send({users});
  });
};
