
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var User = mongoose.model('User')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	add X points to user
*	submit to database
*	check for errors
*/

exports.index = function (req, res) {
  //get id parameter
  var userId = req.param('id')

  var DEFAULT_ADD_POINTS = 100 //default user points per add
  //TODO add all user ranks
  var USER_RANKS = ['Bar Fly', 'Local', 'Bartender', 'Bar Owner', 'Champ', 'Star'] //array of user rank, currently incomplete and test data

  //validate bar id parameter
  userId = validator.blacklist(userId, '()')
  var isValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var isValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length

  //check to see if the user id is the current user's id
  var isAuthorized = false
  if (userId === req.user.id) {isAuthorized = true}

  if (isValidInput && isValidLength && isAuthorized) {
  	//query for the user
  	var theUser = User.findById(userId, function(err, results) {
  		if (err) {console.log(err)}
  		if (results) {
  			//get the user's current score and add the default amount of points
  			var didRankUp = false
  			//convert to int then back to string
  			results.score = (+results.score + DEFAULT_ADD_POINTS).toString()

  			//check to see if user has earned a new rank
  			if (+results.score % 500 == 0) {
  				if (+results.score != 0) {
  					//update user's rank. If rank is maxed out cycle to beginning of the list
  					results.rank = USER_RANKS[(+results.score/500) % (USER_RANKS.length - 1)]
  					didRankUp = true
  				}
  			}

  			//save the user to the database and check results
  			results.save(function(err, results, numberAffected) {
  				if (err) {console.log(err)}
  				if (results) {
  					var success = false
  					if (numberAffected == 1) {
  						success = true
  					}
  					res.json({ "success": success, "didRankChange": didRankUp})
  				}
  			})
  		} else {
  			//console.log('No results found')
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//console.log('Not valid input')
  	res.json({ "error": "No Results Found"})
  }
}
