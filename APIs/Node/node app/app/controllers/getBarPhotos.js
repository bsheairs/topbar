
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	get array of bar photos from db
*	return the array to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get id parameter
  var barId = req.param('id')

  //validate bar id parameter
  barId = validator.blacklist(barId, '()')
  var isValidInput = validator.isAlphanumeric(barId) //validate input for alphanumneric
  var isValidLength = validator.isLength(barId, 24, 24) //validate input for correct ObjectId length

  if (isValidInput && isValidLength) {
  	//query new ObjectId(barId)
  	var theBar = Bar.findById(barId, function(err, results) {
  		if (err) {console.log(err)}
  		if (results) {
  			//response via json with results
        var photos = results.photos

  			res.json({"photos": photos})
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
