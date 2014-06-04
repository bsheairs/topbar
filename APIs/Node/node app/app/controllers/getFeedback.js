
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
*	query db for a bar's comments
*	return array of comments to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var date = req.param('date')
  var feedbackType = req.param('type')
  var limitNum = req.param('limit')


  //validate parameters
  date = validator.blacklist(date, '()')
  feedbackType = validator.blacklist(feedbackType, '()')
  limitNum = validator.blacklist(limitNum, '()')
  var limitNumIsValidInput = validator.isNumeric(limitNum)
  var dateIsValidInput = validator.isFloat(date) //validate input for alphanumneric
  var feedbackTypeIsValidInput = validator.isAlphanumeric(feedbackType) //validate input for alphanumneric
  

  if ((dateIsValidInput || !date) && (feedbackTypeIsValidInput || !feedbackType) && (limitNumIsValidInput || !limitNum)) {
  	//set up query
    var query = Feedback.find({});
    if (date) {query.where('dateSubmitted').gt(+date)}

    if (feedbackType) {query.where('type').equals(feedbackType)}

    if (limitNum) {query.limit(limitNum)}  

    //query for the bar based on id
    var theFeedback = query.exec(function(err, results) {
  		if (err) {console.log(err)}
  		if (results) {
  			//response via json with results
  			res.json(results)
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