
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')

/*
*	Psuedo-code:
*	query database for the bar's current rating and pos and negative votes
*	return array to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var barId = req.param('barid')

  //validation
  barId = validator.blacklist(barId, '()')
  var barIdIsValidInput = validator.isAlphanumeric(barId) //validate input for alphanumneric
  var barIdIsValidLength = validator.isLength(barId, 24, 24) //validate input for correct ObjectId length

  if (barIdIsValidLength && barIdIsValidInput) {
  	//query
  	var theBar = Bar.findById(barId, 'overallRating positiveVotes negativeVotes', function(err, results) {
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
  	//Not valid input
  	res.json({ "error": "No Results Found"})
  }
}
