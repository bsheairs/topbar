
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
*	remove the barId from the database
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
  	var theBar = Bar.findByIdAndRemove(barId, function(err, product) {
  		if (!err) {
  			//send response, remove successful
  			if (product) {
				res.json({ "success": "Bar Removed"})
  			} else {
  				//bar doesn't exist
  				res.json({ "error": "No Results Found"})
  			}
		} else {
  			console.log(err)
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//Not valid input
  	res.json({ "error": "No Results Found"})
  }
}
