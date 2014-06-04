
/*!
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , User = mongoose.model('User')
  , utils = require('../../lib/utils')
  , crypto = require('crypto')
  , validator = require('validator')
  , passport = require('passport')
  , localStrategy = require('passport-local').Strategy
  , Random = require('random-js')

var login = function (req, res) {
  var redirectTo = req.session.returnTo ? req.session.returnTo : '/'
  delete req.session.returnTo
  res.redirect(redirectTo)
}

exports.signin = function (req, res) {}

/**
 * Auth callback
 */

exports.authCallback = login

/**
 * Show login form
 */

exports.login = function (req, res) {
  //need to handle iOS login 
  res.render('users/login', {
    title: 'Login',
    message: req.flash('error')
  })
}

/**
 * Logout
 */

exports.logout = function (req, res) {
  req.logout()
  res.redirect('/login')
}

/**
 * Auth Successs
 */

exports.iOSSuccess = function (req, res) {
  res.send(200)
}

/**
 * Session
 */

exports.session = login

/*
*	Psuedo-code:
*	user resgistration
* email - email of the user
* cityLocation - location of the user
* firstName - first name of the user
* password - user’s password to be hashed
*
*/

exports.register = function (req, res) {
  //get parameters 
  var email = req.param('email')
  var cityLocation = req.param('city')
  var firstName = req.param('firstName')
  var password = req.param('p')
  var isiOS = req.param('d') // True if iphone

  //additional variables
  var updated = (new Date).getTime()
  var favoriteBars = []
  var imageURL = ''
  var hashedPass = ''
  var salt = ''
  var userRole = ''
  var defaultUserRank = 'Bar Fly' //needs to be updated if changed

  //generate salt
  var randomGenerator = new Random(Random.engines.mt19937().autoSeed())
  salt = randomGenerator.string(32)

  //hash password
  if (!password && !salt){
    try {
      hashedPass = crypto.createHmac('sha1', this.salt).update(password).digest('hex')
    } catch (err) {
      console.log(err)
    }
  }

  //set user role
  if (isiOS == '1'){
    userRole = 'iOS'
  } else if (isiOS == '0') {
    userRole = 'barOwner'
  }

  //validate parameters
  email = validator.blacklist(email, '()')
  var emailIsValidInput = validator.isEmail(email)
  cityLocation = validator.blacklist(cityLocation, '()')
  var cityIsValidInput = validator.isAlpha(cityLocation)
  firstName = validator.blacklist(firstName, '()')
  var firstNameIsValidInput = validator.isAlpha(firstName)
  password = validator.blacklist(password, '()')
  var passIsValidLength = validator.isLength(password, 8)
  isiOS = validator.blacklist(isiOS, '()')
  var isiOSValidInput = validator.isInt(isiOS)

  if ((email && emailIsValidInput) && (cityLocation && cityIsValidInput) && (firstName && firstNameIsValidInput) && (password && passIsValidLength) && (isiOS && isiOSValidInput)) {
    //check to see if user already exists with current email
    var theUser = User.find({'email': email}, function(err, results) {
      if (err) {console.log(err)}
      if (results.length == 0){
        //add user to database
        var newUser = new User({'_updated': updated, 'age': '0', 'cityLocation': cityLocation, 'eliteStatus': 'false', 'email': email, 'favoriteBars': favoriteBars, 'firstName': firstName, 'hashedPassword': hashedPass, 'imageURL': imageURL, 'userRole': userRole, 'rank': defaultUserRank, 'salt': salt, 'score': '0'})

        newUser.save(function (err, results, numberAffected) {
          if (err) {console.log(err)}
          if (results) {
              var success = false
              if (numberAffected == 1) {
                success = true
                //login the user
                req.login(results, function(err) {
                  if (err) {console.log(err)}
                  res.json({"success": success, "session": req.sessionID})
                })
              }
          }
        })
      } else {
        //user already exists
        res.json({"error": "User Already Exists"})
      }
    })
  } else {
    //Not valid input
    res.json({ "error": "Input Not Valid"})
  }
}