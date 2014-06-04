
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Bar = mongoose.model('Bar')
 var Feedback = mongoose.model('Feedback')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	take in params for adding a new bar.
*	submit to database
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var userId = req.user.id
  var barName = req.param('name')
  var barSize = req.param('size')
  var barCost = req.param('cost')
  var detailed = req.param('detailed')
  var city = req.param('city')

  //additional for data admin app
  var websiteUrl = req.param('url')
  var longitude = req.param('longitude')
  var latitude = req.param('latitude')
  var photos = req.param('photos') //array of strings app needs to format correctly
  //might have to parse photos
  var categories = req.param('categories') //array of strings app needs to format correctly
  //might have to parse categories
  var phoneNumber = req.param('phone')
  var address = req.param('address')
  var city = req.param('city')

  var userRole = req.user.userRole

  //validation time, only validate if necessary to user role's allowed action
  userId = validator.blacklist(userId, '()')
  var userIsValidInput = validator.isAlphanumeric(userId) //validate input for alphanumneric
  var userIsValidLength = validator.isLength(userId, 24, 24) //validate input for correct ObjectId length
  
  barName = validator.blacklist(barName, '()')
  var barNameIsValidInput = validator.isAlphanumeric(barName) //validate input for alphanumneric
  
  var BAR_SIZE = ['S', 'M', 'L']
  barSize = validator.blacklist(barSize, '()')
  var barSizeIsValidInput = false
  for(var i = 0; i < BAR_SIZE.length; i++){
  	if (barSize === BAR_SIZE[i]) {barSizeIsValidInput = true}
  }

  var BAR_COST = ['$', '$$', '$$$']
  barCost = validator.blacklist(barCost, '()')
  var barCostIsValidInput = false
  for(var i = 0; i < BAR_COST.length; i++){
  	if (barCost === BAR_COST[i]) {barCostIsValidInput = true}
  }

  detailed = validator.blacklist(detailed, '()')
  var detailedIsValidInput = validator.isAlphanumeric(detailed)

  //validate additional parameters
  if ((userRole == 'administrator' || userRole == 'reviewer') && userRole != 'iOS') {
  	websiteUrl = validator.blacklist(websiteUrl, '()')
  	var websiteUrlIsValidInput = validator.isURL(websiteUrl, {protocols: ['http','https'], require_protocol: true})

  	longitude = validator.blacklist(longitude, '()')
  	var longitudeIsValidInput = validator.matches(longitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

  	latitude = validator.blacklist(latitude, '()')
  	var latitudeIsValidInput = validator.matches(latitude, /^-{0,1}[0-9]{1,3}.[0-9]{1,}$/)

  	photos = validator.blacklist(photos, '()')
  	var photosArray = photos.split(',') 
  	var photosIsValidInput = false
  	for (var i = 0; i < photosArray.length; i++){
  		if (validator.isURL(photosArray[i], {protocols: ['http','https'], require_protocol: true})) {
  			photosIsValidInput = true
  		} else {
  			photosIsValidInput = false
  			break
  		}
  	}

  	//do something about validating categories in the future
  	var DEFAULT_CATEGORIES = ['Frattastic', 'Bar', 'Pub', 'Club', 'Whiskey', 'Cigar'] //add more categories once finalized

  	categories = validator.blacklist(categories, '()')
  	var categoriesArray = categories.split(',')
  	var categoriesIsValidInput = false
  	for (var i = 0; i < categoriesArray.length; i++){
  		if (!validator.isAlphanumeric(categoriesArray[i])) {
  			categoriesIsValidInput = false
  			break
  		} else {
  			categoriesIsValidInput = true
  		}
  	}

  	//validate categories input
  	var categoryIsValid = false
  	if (categoriesIsValidInput) {
      for(var i = 0; i < categoriesArray.length; i++) {
        for (var j = 0; j < DEFAULT_CATEGORIES.length; j++) {
          if (categoriesArray[i] == DEFAULT_CATEGORIES[j]) {categoryIsValid = true}
        }
        if (categoryIsValid == false) {break}
      }
    }

  	phoneNumber = validator.blacklist(phoneNumber, '()-+')
  	var phoneNumberIsValidInput = validator.isNumeric(phoneNumber)

  	address = validator.blacklist(address, '()')
  	var addressIsValidInput = validator.matches(address, /^[A-Za-z,\d\s]+$/)

    city = validator.blacklist(city, '()')
    var cityIsValidInput = validator.matches(city, /^[A-Za-z ]*,[ ]?[A-Za-z]*$/)
  }

  if (userRole == 'administrator' || userRole =='reviewer') {
  	//submit to bar collection if data admin app user
  	if ((userIsValidInput && userIsValidLength) && barNameIsValidInput && barCostIsValidInput && barSizeIsValidInput && websiteUrlIsValidInput && longitudeIsValidInput && latitudeIsValidInput && photosIsValidInput && (categoriesIsValidInput && categoryIsValid) && (photosIsValidInput || !phoneNumber) && addressIsValidInput && cityIsValidInput) {
  		var updated = (new Date).getTime()
  		var negativeVotes = 0
  		var positiveVotes = 0
  		var overallRating = 0
  		var averageRatings = {}
  		averageRatings.monday = 0
  		averageRatings.tuesday = 0
  		averageRatings.wednesday = 0
  		averageRatings.thursday = 0
  		averageRatings.friday = 0
  		averageRatings.saturday = 0
  		averageRatings.sunday = 0

  		var bar = new Bar({'_updated': updated, 'address': address, 'city': city, 'barName': barName, 'cost': barCost, 'loc': { type: 'Point', coordinates: [parseFloat(longitude), parseFloat(latitude)]}, 'negativeVotes': negativeVotes, 'overallRating': overallRating, 'positiveVotes': positiveVotes, 'phoneNumber': phoneNumber, 'size': barSize, 'photos': photosArray, 'categories': categoriesArray, 'averageRatings': averageRatings, 'websiteURL': websiteUrl})

  		//check if bar already exists
  		var doesExist = Bar.find({})
  		doesExist.where('barName').equals(barName)
  		doesExist.where('address').equals(address)

  		doesExist.exec(function (err, results) {
  			if (err) {console.log(err)}
  			if ((results.length > 0)) {
  				res.json({"error": 'Entry Already Exists'})
  			} else {
  				bar.save(function (err, results, numberAffected) {
		  			if (err) {console.log(err)}
		  			if (results) {
		  				var success = false
		  				if (numberAffected == 1) {
		 					success = true
		  				}
		  			res.json({"success": success})
	  				}
	  			})
  			}
  		})
  	} else {
  		//console.log('Not valid input from add bar')
  		res.json({ "error": "Generic Error"})
  	}
  } else if (userRole == 'iOS') {
  	//submit to feedback collection if iOS user
	  	if ((userIsValidInput && userIsValidLength) && (detailedIsValidInput || !detailed) && barNameIsValidInput && (barCostIsValidInput || !barCost) && (barSizeIsValidInput || !barSize)) {
		  	var type = 'addBar'
		  	var date = (new Date).getTime()

		  	var feedback = new Feedback({ 'type': type, 'user': userId, 'dateSubmitted': date, 'category': 'Add Bar' })

		  	if (detailed) {feedback.detailedFeedback = detailed}
			
			  var additionalOptions = [barName , barSize, barCost] //add all additional parameters once finalized
			  var additional = {}
			  //add additional fields to additiona object
			  if (barName) {additional.barName = barName}
			  if (barCost) {additional.barCost = barCost}
			  if (barSize) {additional.barSize = barSize}
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
	  		//console.log('Not Valid Input')
	  		res.json({ "error": "Generic Error"})
	  	}
  } else {
	  		//console.log('Not Authorized')
	  		res.json({ "error": "Generic Error"})
  }
}