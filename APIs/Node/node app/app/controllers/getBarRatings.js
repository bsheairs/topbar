
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 var BarRating = mongoose.model('BarRating')

/*
*	Psuedo-code:
*	query database for the bar's current rating and pos and negative votes
*	return array to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var barId = req.param('barid')
  var beginDateRange = req.param('beginDateRange') //optional for Bar Metric App

  var DEFAULT_DATE_RANGE = 10 //10 days history is default
  var currentDate = (new Date).getTime()/1000.0
  var userRole = req.user.userRole

  //validation
  barId = validator.blacklist(barId, '()')
  var barIdIsValidInput = validator.isAlphanumeric(barId) //validate input for alphanumneric
  var barIdIsValidLength = validator.isLength(barId, 24, 24) //validate input for correct ObjectId length

  beginDateRange = validator.blacklist(beginDateRange, '()')
  var beginDateRangeIsValidInput = validator.isDate(beginDateRange)

  if (barIdIsValidLength && barIdIsValidInput && (!beginDateRange || beginDateRangeIsValidInput)) {
  	//query
  	var theBar = Bar.findById(barId, 'overallRating positiveVotes negativeVotes', function (err, bar) {
  		if (err) {console.log(err)}
  		if (bar) {
  			//response via json with results
  			var dateRange = DEFAULT_DATE_RANGE * 86400 //seconds per day

  			var theBarRatings = BarRating.find({'barId': barId})

  			if (userRole == 'marketResearcher' || userRole == 'barOwner' || userRole == 'administrator') {
  				if(beginDateRange) { beginDateRange = Date.parse(beginDateRange)/1000.0 }

  				if (beginDateRange) {
  					theBarRatings.where('dateSubmitted').gte(beginDateRange)
  				} else {
  					theBarRatings.where('dateSubmitted').gte(currentDate - dateRange) //find the date based on the default range
  				}
  			} else {
				theBarRatings.where('dateSubmitted').gte(currentDate - dateRange) //find the date based on the default range
  			}

  			theBarRatings.sort({'dateSubmitted': -1})

  			theBarRatings.exec(function (err, barRatings) {
  				if (err) {console.log(err)}
  				if (barRatings.length > 0) {
  					res.json({'bar': bar, 'ratings': barRatings})
  				} else {
  					//console.log('No results found')
  					res.json({ "error": "No Results Found"})
  				}	
  			})
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
