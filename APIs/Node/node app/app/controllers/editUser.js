
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var User = mongoose.model('User')
 var Random = require('random-js')
 var crypto = require('crypto')

/*
*	Psuedo-code: edit user
*/

exports.index = function (req, res) {
  var userRole = req.user.userRole

  //get parameters 
  var userId = req.param('userId')
  var cityLocation = req.param('city')
  var firstName = req.param('firstName')
  var password = req.param('p')
  var role = req.param('role')
  var eliteStatus = req.param('eliteStatus') //0 or 1
  var imageURL = req.param('imageURL') //optional
  var score = req.param('score')

  //additional variables
  var updated = (new Date).getTime()
  var favoriteBars = []
  var hashedPass = ''
  var salt = ''

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
  userId = validator.blacklist(userId, '()')
  var userIdIsValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var userIdIsValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length
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
  score = validator.blacklist(score, '()')
  var scoreIsValidInput = validator.isNumeric(score)

  if (userRole == 'administrator') {
  	if ((!cityLocation || cityIsValidInput) && (!firstName || firstNameIsValidInput) && (!password || passIsValidLength) && (!role || roleIsValidInput) && (!eliteStatus || eliteStatusIsValidInput) && (!imageURL || imageURLIsValidInput) && (!score || scoreIsValidInput)) {
	    //check to see if user already exists with current email
	    var theUser = User.findById(userId, function(err, results) {
	      if (err) {console.log(err)}
	      if (results){
	        //edit user from database

	        if (cityLocation) {results.cityLocation = cityLocation}
	        if (firstName) {results.firstName = firstName}
	        if (password) {
	        	results.hashedPassword = hashedPass
	        	results.salt = salt
	        }
	        if (role) {results.userRole = role}
	        if (eliteStatus) {
	        	//correctly format eliteStatus	
		        if (eliteStatus == 0) {
		        	eliteStatus = 'false'
		        	results.eliteStatus = eliteStatus
		        } else if (eliteStatus == 1) {
		        	eliteStatus = 'true'
		        	results.eliteStatus = eliteStatus
		        }	
	        }	
	        if (imageURL) {results.imageURL = imageURL}
	        if (score) {results.score = score}
	        
	        results.save(function (err, results, numberAffected) {
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
	        //user doesn't exist
	        res.json({"error": "User Does Not Exist"})
	      }
	    })
  	} else {
    	//Not valid input
    	res.json({ "error": "Input Not Valid"})
  	}
  } else if ((userRole == 'barOwner' || userRole == 'marketResearcher') && (req.user.id == userId)) {
  		if ((!cityLocation || cityIsValidInput) && (!firstName || firstNameIsValidInput) && (!password || passIsValidLength) && (!imageURL || imageURLIsValidInput)) {
		    //check to see if user already exists with current email
		    var theUser = User.findById(userId, function(err, results) {
		      if (err) {console.log(err)}
		      if (results){
		        //edit user from database

		        if (cityLocation) {results.cityLocation = cityLocation}
		        if (firstName) {results.firstName = firstName}
		        if (password) {
		        	results.hashedPassword = hashedPass
		        	results.salt = salt
		        }
		        if (imageURL) {results.imageURL = imageURL}
		        
		        results.save(function (err, results, numberAffected) {
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
		        //user doesn't exist
		        res.json({"error": "User Does Not Exist"})
		      }
		    })
	  	} else {
	    	//Not valid input
	    	res.json({ "error": "Input Not Valid"})
	  	}
  } else {
  	//Not Authorized
  	//Code really should never run if authorization middlewear runs correctly
    res.json({ "error": "Not Authorized"})
  }
}
