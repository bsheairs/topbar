
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var User = mongoose.model('User')

/*
*	Psuedo-code: edit user
*/

exports.index = function (req, res) {
  //get parameters 
  var userId = req.param('userId')
  var email = req.param('email')
  var confirmEmail = req.param('confirmEmail')

  //validate parameters
  userId = validator.blacklist(userId, '()')
  var userIdIsValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var userIdIsValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length
  email = validator.blacklist(email, '()')
  var emailIsValidInput = validator.isEmail(email)
  confirmEmail = validator.blacklist(confirmEmail, '()')
  var confirmEmailIsValidInput = validator.isEmail(confirmEmail)
  var emailAreSame = false
  if (email == confirmEmail) {emailAreSame = true}

  if (userIdIsValidInput && userIdIsValidLength && emailIsValidInput && emailAreSame) {	    //check to see if user already exists with current email	    
  	var checkEmail = User.find({"email": email}, function(err, emailExist) {
      if (err) {console.log(err)}
      if (emailExist.length != 0){
        //email is already in use
        res.json({"error": "Email Already In Use"})
      } else {
      	var theUser = User.findById(userId, function(err, results) {
	      if (err) {console.log(err)}
	      if (results){
	        //edit user from database

	        if (email) {results.email = email}
		        
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
      }
    })
  } else {
   	//Not valid input
   	res.json({ "error": "Input Not Valid"})
  } 
}