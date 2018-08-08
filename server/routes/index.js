const express = require('express')
const router = express.Router()
const articleClient = require('../dbClients/articlesDB')

var ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next()
  } else {
    // req.flash('error_msg','You are not logged in');
    res.redirect('/users/login')
  }
}

// Get Homepage
router.get('/', ensureAuthenticated, (req, res, next) => {
  const callback = (error, articles) => {
    if (error) {
      next(error) // Pass errors to Express.
    } else {
      res.render('articles-list', {
        articles: articles,
        home: 'homeNav'
      })
    }
  }
  articleClient.findArticles({}, callback)
})

module.exports = router
