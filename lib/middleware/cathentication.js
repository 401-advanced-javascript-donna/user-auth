
module.exports = password => (req, res, next) => {
  const auth = req.get('Authorization');
  if(auth === password) {
    next();
  }
  else {
    next({
      statusCode: 401,
      error: 'Only cats allowed'
    });
  }
};