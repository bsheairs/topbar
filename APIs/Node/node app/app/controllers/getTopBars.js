/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 var User = mongoose.model('User')
 var AppLocations = mongoose.model('AppLocations')

/*
*	Psuedo-code:
*	query database for the topbars with any filters (if applicable)
*	return array to the user
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var userId = req.param('id')
  var latitude = req.param('latitude')
  var longitude = req.param('longitude')
  var mileRadius = req.param('mileRadius')
  var barSize = req.param('size')
  var barCost = req.param('cost')
  var barCategories = req.param('categories') //comma delimited 

  //additional variables
  var DEFAULT_BAR_SIZES = ['S', 'M', 'L']
  var DEFAULT_BAR_COSTS = ['$', '$$', '$$$']
  var DEFAULT_LOCATION_RADIUS = 30 //30 miles
  var DEFAULT_BAR_RADIUS = 10 //10 miles

  //validate parameters
  userId = validator.blacklist(userId, '()')
  var userIdIsValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var userIdIsValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length

  latitude = validator.blacklist(latitude, '()')
  var latitudeIsValidInput = validator.matches(latitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

  longitude = validator.blacklist(longitude, '()')
  var longitudeIsValidInput = validator.matches(longitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

  mileRadius = validator.blacklist(mileRadius, '()')
  var mileRadiusIsValidInput = validator.isNumeric(mileRadius)

  barSize = validator.blacklist(barSize, '()')
  var barSizeIsValidInput = validator.isIn(barSize, DEFAULT_BAR_SIZES)

  barCost = validator.blacklist(barCost, '()')
  var barCostIsValidInput = validator.isIn(barCost, DEFAULT_BAR_COSTS)

  barCategories = validator.blacklist(barCategories, '()')
  var barCategoriesArray = barCategories.split(',')
  var barCategoriesIsValidInput = false
  for (var i = 0; i < barCategoriesArray.length; i++){
  	if (!validator.isAlphanumeric(barCategoriesArray[i])) {
  		barCategoriesIsValidInput = false
  		break
  	} else {
  		barCategoriesIsValidInput = true
  	}
  }

  if ((!userId || (userIdIsValidLength && userIdIsValidInput)) && latitudeIsValidInput && longitudeIsValidInput && (!mileRadius || mileRadiusIsValidInput) && (!barSize || barSizeIsValidInput) && (!barCost || barCostIsValidInput) && (!barCategories || barCategoriesIsValidInput)) {

  	var theLocation = AppLocations.find({ 'loc': {$geoWithin: { $centerSphere: [[parseFloat(longitude), parseFloat(latitude)], 30 / 3959]}}})
  	theLocation.exec(function (err, location) {
  		//do rest of query
  		if (err) {console.log(err)}
	  	if (location.length > 0) {
	  		//response via json with results
  			var mileRadiusFilter = 0
  			if (location[0].radius) {
  				mileRadiusFilter = location[0].radius
  				console.log('bar radius: ' + location[0].radius)
  			} else {
  				mileRadiusFilter = DEFAULT_BAR_RADIUS
  			}

  			//build query for top bars here
  			if (mileRadius) { mileRadiusFilter = mileRadius }

  			var bars = Bar.find({ 'loc': {$geoWithin: { $centerSphere: [[location[0].loc.coordinates[0], location[0].loc.coordinates[1]], mileRadiusFilter / 3959]}}})

  			if (barSize) { bars.where('size').equals(barSize) }
  			if (barCost) { bars.where('cost').equals(barCost) }
  			if (barCategories) { bars.where('categories').in(barCategoriesArray) }

  			bars.limit(200) //limit only 200 for the top list for the time being
  			bars.sort({'overallRating': -1})
  			bars.select('_id barName overallRating size cost categories')

  			bars.exec(function (err, results) {
	  			if (err) {console.log(err)}
	  			if (results.length > 0) {
	  				//send results of top bars
	  				res.json(results)
	  			} else {
	  				//console.log('No Results Found')
	  				res.json({ "error": "No Results Found" })
	  			}	
			})
	  	} else {
	  		//console.log('No Results Found')
	  		res.json({ "error": "Location Not Found" })
	  }
  	})
  } else {
  	//console.log('Not Valid Input')
  	res.json({ "error": "Not Valid Input" })
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