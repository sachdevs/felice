var express = require('express'),
  router = express.Router(),
  mongoose = require('mongoose'),
  Article = mongoose.model('Article'),
  User = mongoose.model('User');

module.exports = function (app) {
  app.use('/', router);
};

router.get('/', function (req, res, next) {
  Article.find(function (err, articles) {
    if (err) return next(err);
    res.render('index', {
      title: 'felice'
    });
  });
});

function isAuthenticated(req, res, next) {
    if (req.user.authenticated)
        return next();
    res.redirect('/login');
}