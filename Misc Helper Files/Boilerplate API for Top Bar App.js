//boilerplate API for Top Bar App

/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 var User = mongoose.model('User')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	query on the barId for all necessary bar information.
*	display back to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get id parameter
  var barId = req.param('id')

  //validate bar id parameter
  barId = validator.blacklist(barId, '()')
  var isValidInput = validator.isAlphanumeric(barId)

  if (isValidInput) {
  	//query
  	var theBar = Bar.findOne({_id: barId}, function(err, results) {
  		if (err) {console.log(err)}
  		if (results.length > 0) {
  			//response via json

  		} else {
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//Not valid input
  	res.json({ "error": "No Results Found"})
  }
}