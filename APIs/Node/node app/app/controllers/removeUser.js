
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var User = mongoose.model('User')

/*
*	Psuedo-code:
*	Check uauthentication and session.
*	if valid, continue; otherwise authenticate
*	take in rating parameter and barId.
*	Run the algo to update the bar's rating
*	return bool if action was sucessful
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var userId = req.param('userId')

  //validation
  userId = validator.blacklist(userId, '()')
  var userIdIsValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var userIdIsValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length

  if (userIdIsValidLength && userIdIsValidInput) {
  	//query
  	var theUser = User.findByIdAndRemove(userId, function(err, product) {
  		if (!err) {
  			//send response, remove successful
  			if (product) {
				res.json({ "success": "User Removed"})
  			} else {
  				//user doesn't exist
  				res.json({ "error": "No Results Found"})
  			}
		} else {
  			console.log(err)
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//Not valid input
  	res.json({ "error": "Not Valid Input"})
  }
}
