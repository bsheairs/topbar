
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var User = mongoose.model('User')
 var Random = require('random-js')
 var crypto = require('crypto')

/*
*	Psuedo-code: add user
*/

exports.index = function (req, res) {
  //get parameters 
  var email = req.param('email')
  var cityLocation = req.param('city')
  var firstName = req.param('firstName')
  var password = req.param('p')
  var role = req.param('role')
  var eliteStatus = req.param('eliteStatus') //0 or 1
  var imageURL = req.param('imageURL') //optional

  //additional variables
  var updated = (new Date).getTime()
  var favoriteBars = []
  var hashedPass = ''
  var salt = ''
  var defaultUserRank = 'Bar Fly' //needs to be updated if changed

  var DEFAULT_ROLES = ['administrator', 'iOS', 'barOwner', 'marketResearcher', 'reviewer']

  //generate salt
  var randomGenerator = new Random(Random.engines.mt19937().autoSeed())
  salt = randomGenerator.string(32)

  //hash password
  if (password && salt){
    try {
      hashedPass = crypto.createHmac('sha1', salt).update(password).digest('hex')
    } catch (err) {
      console.log(err)
    }
  }

  //validate parameters
  email = validator.blacklist(email, '()')
  var emailIsValidInput = validator.isEmail(email)
  cityLocation = validator.blacklist(cityLocation, '()')
  var cityIsValidInput = validator.matches(cityLocation, /^[A-Za-z ]*,[ ]?[A-Za-z]*$/)
  firstName = validator.blacklist(firstName, '()')
  var firstNameIsValidInput = validator.isAlpha(firstName)
  password = validator.blacklist(password, '()')
  var passIsValidLength = validator.isLength(password, 8)
  role = validator.blacklist(role, '()')
  var roleIsValidInput = validator.isIn(role, DEFAULT_ROLES)
  eliteStatus = validator.blacklist(eliteStatus, '()')
  var eliteStatusIsValidInput = validator.isNumeric(eliteStatus)
  imageURL = validator.blacklist(imageURL, '()')
  var imageURLIsValidInput = validator.isURL(imageURL, {protocols: ['http','https'], require_protocol: true})
  

  if ((email && emailIsValidInput) && (cityLocation && cityIsValidInput) && (firstName && firstNameIsValidInput) && (password && passIsValidLength) && (role && roleIsValidInput) && (eliteStatus && eliteStatusIsValidInput) && (!imageURL || imageURLIsValidInput)) {
    //check to see if user already exists with current email
    var theUser = User.find({'email': email}, function(err, results) {
      if (err) {console.log(err)}
      if (results.length == 0){
        //add user to database
        if (!imageURL) {imageURL = ''}

        //correctly format eliteStatus	
        if (eliteStatus == 0) {
        	eliteStatus = 'false'
        } else if (eliteStatus == 1) {
        	eliteStatus = 'true'
        }	

        var newUser = new User({'_updated': updated, 'age': '0', 'cityLocation': cityLocation, 'eliteStatus': eliteStatus, 'email': email, 'favoriteBars': favoriteBars, 'firstName': firstName, 'hashedPassword': hashedPass, 'imageURL': imageURL, 'userRole': role, 'rank': defaultUserRank, 'salt': salt, 'score': '0'})

        newUser.save(function (err, results, numberAffected) {
          if (err) {console.log(err)}
          if (results) {
              var success = false
              if (numberAffected == 1) {
                success = true
              }
              res.json({"success": success})
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
