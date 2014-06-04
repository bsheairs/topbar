
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 var Rating = mongoose.model('Rating')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	submit user rating to update rating api
*	check for errors
*/

exports.index = function (req, res) {
	//get parameters
	var userId = req.user.id
	var barId = req.param('barId')
	var date = (new Date).getTime()	
	var rating = req.param('rating') //0 or 1
	var latitude = req.param('latitude')
	var longitude = req.param('longitude')

	//additional variables
	var isUser = false
	if (userId) { 
		isUser = true
	} else {
		userId = '000000000000000000000000' //undefined user name
	}

	var DEFAULT_DISTANCE_S = 75; //max distance from a S sized bar
	var DEFAULT_DISTANCE_M = 150; //max distance from a M sized bar
	var DEFAULT_DISTANCE_L = 200; //max distance from a L sized bar

	//validate parameters
	barId = validator.blacklist(barId, '()')
  	var barIdIsValidInput = validator.isAlphanumeric(barId) //validate input for alphanumneric
  	var barIdIsValidLength = validator.isLength(barId, 24, 24) //validate input for correct ObjectId length

  	rating = validator.blacklist(rating, '()')
  	var ratingIsValidInput = false
  	if (rating == '1' || rating == '0') { ratingIsValidInput = true }

  	latitude = validator.blacklist(latitude, '()')
  	var latitudeIsValidInput = validator.matches(latitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

	longitude = validator.blacklist(longitude, '()')
	var longitudeIsValidInput = validator.matches(longitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

	if (barIdIsValidLength && barIdIsValidInput && ratingIsValidInput && latitudeIsValidInput && longitudeIsValidInput) {
		//rate the bar!
		var theBar = Bar.findById(barId, function(err, results) {
	  		if (err) {console.log(err)}
	  		if (results) {
	  			//check if user is in the bar with the GPS coordinates
	  			var distanceFromBar = gpsDistance(results.loc.coordinates[1], results.loc.coordinates[0], latitude, longitude)
	  			var isUserAtBar = false
	  			var barSize = results.size

	  			if (barSize == 'S') {
	  				if (distanceFromBar <= DEFAULT_DISTANCE_S) 
	  					isUserAtBar = true
	  			} else if (barSize == 'M') {
	  				if (distanceFromBar <= DEFAULT_DISTANCE_M) 
	  					isUserAtBar = true
	  			} else if (barSize == 'L') {
	  				if (distanceFromBar <= DEFAULT_DISTANCE_L) 
	  					isUserAtBar = true
	  			}

	  			if (isUserAtBar) {
	  				//count rating
	  				var newRating = new Rating({'barId': barId, 'userId': userId, 'dateSubmitted': date, 'ratingValue': rating})

	  				newRating.save(function (err, results, numberAffected) {
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
					//console.log('User Not At Bar')
  					res.json({ "error": "User Not At Bar"})
	  			}
	  		} else {
  				//console.log('No results found')
  				res.json({ "error": "No Results Found"})
  			}
  		})
	} else {
  		//console.log('Not valid input')
  		res.json({ "error": "Not Valid Input"})
  }
}

var gpsDistance = function (lat1,lon1,lat2,lon2) {
  var R = 3956.5467 // Radius of the earth in miles
  var feet = 5280 //miles to feet for conversaion later
  var dLat = deg2rad(lat2-lat1)  // deg2rad below
  var dLon = deg2rad(lon2-lon1) 
  var a = Math.sin(dLat/2) * Math.sin(dLat/2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon/2) * Math.sin(dLon/2)
     
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  var d = R * c // Distance in miles
  return d * feet //convert to feet
}

var deg2rad = function (deg) {
  return deg * (Math.PI/180)
}