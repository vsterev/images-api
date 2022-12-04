function ifImageExists() {
    return function (req, res, next) {
     console.log('Tuuuuuuuuuuuuuuuk',req.files)
    //  next();
    };
  }
  module.exports = ifImageExists();