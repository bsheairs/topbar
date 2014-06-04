
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
var passportOptions = {
  failureFlash: 'Invalid email or password.',
  failureRedirect: '/login'
}

/**
 * Controllers
 */

var users = require('../app/controllers/users')
  , getTopBars = require('../app/controllers/getTopBars')
  , search = require('../app/controllers/search')
  , getBarInfo = require('../app/controllers/getBarInfo')
  , submitFeedback = require('../app/controllers/submitFeedback')
  , rateBar = require('../app/controllers/rateBar')
  , addBar = require('../app/controllers/addBar') 
  , getBarPhotos = require('../app/controllers/getBarPhotos')
  , addUserPoints = require('../app/controllers/addUserPoints')
  , removeBar = require('../app/controllers/removeBar')
  , barRecommendations = require('../app/controllers/barRecommendations')
  , getComments = require('../app/controllers/getComments')
  , editBar = require('../app/controllers/editBar')
  , auth = require('./middlewares/authorization')
  , removeComment = require('../app/controllers/removeComment')
  , getFeedback = require('../app/controllers/getFeedback')
  , getBarRating = require('../app/controllers/getBarRating')
  , getBarRatings = require('../app/controllers/getBarRatings')
  , addUser = require('../app/controllers/addUser')
  , editUser = require('../app/controllers/editUser')
  , editUserEmail = require('../app/controllers/editUserEmail')
  , removeUser = require('../app/controllers/removeUser')
  , home = require('../app/controllers/home') //for testing purposes
  , test = require('../app/controllers/test') //for testing purposes

/**
 * Route middlewares
 */

var userAuth = [auth.requiresLogin, auth.user.hasAuthorization]
var addBarAuth = [auth.requiresLogin, auth.addBar.hasAuthorization]
var addUserPointsAuth = [auth.requiresLogin, auth.addUserPoints.hasAuthorization]
var removeBarAuth = [auth.requiresLogin, auth.removeBar.hasAuthorization]
var editBarAuth = [auth.requiresLogin, auth.editBar.hasAuthorization]
var removeCommentAuth = [auth.requiresLogin, auth.removeComment.hasAuthorization]
var getFeedbackAuth = [auth.requiresLogin, auth.getFeedback.hasAuthorization]
var submitFeedbackAuth = [auth.requiresLogin, auth.submitFeedback.hasAuthorization]
var getBarRatingsAuth = [auth.requiresLogin, auth.getBarRatings.hasAuthorization]
var modifyUserAuth = [auth.requiresLogin, auth.modifyUser.hasAuthorization]
var editUserAuth = [auth.requiresLogin, auth.editUser.hasAuthorization]

module.exports = function (app, passport) {

  app.get('/', home.index)
  //debug NEEDS TO BE TAKEN OUT EVENTUALLY
  app.get('/test', test.index)

  //APIs
  //app.get('/articles/:id/edit', articleAuth, articles.edit)
  app.get('/login', users.login)
  app.get('/logout', users.logout)
  app.get('/register', users.register)
  app.post('/users/session',
    passport.authenticate('local', {
      failureRedirect: '/login',
      failureFlash: 'Invalid email or password.'
    }), users.session)
  app.post('/users/iOSSession', passport.authenticate('local'), users.session)
  app.get('/getTopBars', getTopBars.index)
  app.get('/search', search.index)
  app.get('/getBarInfo', auth.requiresLogin, getBarInfo.index)
  app.get('/submitFeedback', submitFeedbackAuth, submitFeedback.index)
  app.get('/getFeedback', getFeedbackAuth, getFeedback.index)
  app.get('/rateBar', rateBar.index) //prompts user after to auth for more, in iOS	
  app.get('/addBar', addBarAuth, addBar.index)
  app.get('/getBarPhotos', auth.requiresLogin, getBarPhotos.index)
  app.get('/addUserPoints', addUserPointsAuth, addUserPoints.index)
  app.get('/removeBar', removeBarAuth, removeBar.index)
  app.get('/barRecommendations', auth.requiresLogin, barRecommendations.index)
  app.get('/getComments', auth.requiresLogin, getComments.index)
  app.get('/removeComment', removeCommentAuth, removeComment.index)
  app.get('/editBar', editBarAuth, editBar.index)
  app.get('/getBarRating', getBarRating.index)
  app.get('/getBarRatings', auth.requiresLogin, getBarRatings.index)
  app.get('/addUser', modifyUserAuth, addUser.index)
  app.get('/editUser', editUserAuth, editUser.index)
  app.get('/editUserEmail', modifyUserAuth, editUserEmail.index)
  app.get('/removeUser', modifyUserAuth, removeUser.index)

}
