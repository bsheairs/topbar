
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Feedback = mongoose.model('Feedback')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	take params for any submitted feedback
*	submit to the database for reviewers
*	return any booleans
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var userId = req.param('id')
  var category = req.param('category')
  var detailed = req.param('detailed')

  //handle additional parameters
  var gps = req.param('gps')
  var barName = req.param('barName')
  //add all additional parameters once finalized

  var FEEDBACK_CATEGORIES = ['Bar Not Found', 'GPS Location Incorrect', 'Bar Information Incorrect'] //add all categories once finalized

  //validate parameters
  userId = validator.blacklist(userId, '()')
  category = validator.blacklist(category, '()')
  detailed = validator.blacklist(detailed, '()')
  var isValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var isValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length
  var detailedIsValidInput = validator.isAlphanumeric(detailed) //validate input for alphanumneric
  var categoryIsValidInput = false

  //validate catogory is legit
  for(var i = 0; i < FEEDBACK_CATEGORIES.length; i++){
  	if (category === FEEDBACK_CATEGORIES[i]) {categoryIsValidInput = true}
  }

  //validate additional parameters
  gps = validator.blacklist(gps, '()')
  barName = validator.blacklist(barName, '()')
  var gpsIsValidInput = validator.isAlphanumeric(gps)
  var barNameIsValidInput = validator.isAlphanumeric(barName)

  if ((isValidInput && isValidLength) && (detailedIsValidInput || !detailed) && categoryIsValidInput && (gpsIsValidInput || !gps) && (barNameIsValidInput || !barName)) {
  	var type = 'feedback'
  	var date = (new Date).getTime()

  	var feedback = new Feedback({ 'type': type, 'user': userId, 'dateSubmitted': date, 'category': category })

  	if (detailed) {feedback.detailedFeedback = detailed}
	
	var additionalOptions = [gps, barName] //add all additional parameters once finalized
	var additional = {}
	//add additional fields to additiona object
	if (gps) {additional.gps = gps}
	if (barName) {additional.barName = barName}
	//add all additional parameters once finalized

  	feedback.additionalFields = additional

  	feedback.save(function (err, results, numberAffected) {
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
  	//console.log('Not valid input')
  	res.json({ "error": "Generic Error"})
  }
}
