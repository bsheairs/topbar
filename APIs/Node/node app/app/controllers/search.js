
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 

/*
*	Search for a Bar based on the name
*   Psuedo-code:
*	take in barName as a search param (?q=X)
*   validate all input
*	search for the bar 
*	return any results to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get search parameter
  var barSearch = req.param('q')
  
  //validate search parameter
  barSearch = validator.blacklist(barSearch, '()')
  var isValidInput = validator.isAlphanumeric(barSearch)

  if (isValidInput) {
	//set up for query
	var rebarSearch = new RegExp('.*' + validator.escape(barSearch) + '.*', 'i')

	//query
	var bars = Bar.find({'barName': { $regex: rebarSearch}}, function(err, results) {
	  if (err) {console.log(err)}
	  if (results.length > 0) {
	  	//response via json with results
	  	var jsonResults = '{'
	  	for (var i = 0; i < results.length; i++){
	  		jsonResults = jsonResults + ' \"barResult' + i + '\": { \"barId\": ' + '\"' + results[i]._id + '\"' + ', \"barName\": ' + '\"' + results[i].barName + '\"' + ', \"overallRating\": ' + '\"' + results[i].overallRating + '\"' + '}'
	  		if (results.length > 1 && (results.length - 1) != i) { jsonResults = jsonResults + ', '}
	  	}
	  	jsonResults = jsonResults + '}'

	  	//parse string to JSON
	  	var jsonObj = JSON.parse(jsonResults)

	  	//send JSON response
	  	res.json(jsonObj)
	  } else {
	  	//console.log('No Results Found')
	  	res.json({ "error": "No Results Found" })
	  }	
	})
  } else {
  	//console.log('Not Valid Input')
  	res.json({ "error": "Not Valid Input" })
  }	
}
