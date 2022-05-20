exports.handleCustomErrors = (err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({msg: err.msg});
  } else next(err);
};

exports.handlePsqlErrors = (err, req, res, next) => {
  if (err.code === '22P02') {
    res.status(400).send({msg: 'Invalid Input'});
  }
  if (err.code === '23502') {
    res.status(400).send({msg: 'Invalid Input'});
  }
  if (err.detail.includes('is not present in table "users"')) {
    res.status(404).send({msg: 'Username Does Not Exist'});
  } else next(err);
};

exports.handleServerErrors = (err, req, res, next) => {
  res.status(500).send({msg: 'Internal Server Error'});
};
