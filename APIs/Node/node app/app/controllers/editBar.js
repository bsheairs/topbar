
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
*	take params from the user
*	submit to database
*	check for errors
*/

exports.index = function (req, res) {
  //do something about validating categories in the future
  var DEFAULT_CATEGORIES = ['Frattastic', 'Bar', 'Pub', 'Club', 'Whiskey', 'Cigar'] //add more categories once finalized
  var userRole = req.user.userRole

  //get parameters
  var barId = req.param('barId')
  var address = req.param('address')
  var phoneNumber = req.param('phone')
  var website = req.param('url')
  var categories = req.param('categories') //comma delimited
  var photos = req.param('photos') //comma delimited

  //data admin only parameters
  var barName = req.param('barName')
  var city = req.param('city')

  //validation
  barId = validator.blacklist(barId, '()')
  var barIdIsValidInput = validator.isAlphanumeric(barId) //validate input for alphanumneric
  var barIdIsValidLength = validator.isLength(barId, 24, 24) //validate input for correct ObjectId length
  
  address = validator.blacklist(address, '()')
  var addressIsValidInput = validator.matches(address, /^[A-Za-z,\d\s]+$/)
  
  phoneNumber = validator.blacklist(phoneNumber, '()-+')
  var phoneNumberIsValidInput = validator.isNumeric(phoneNumber)
  
  website = validator.blacklist(website, '()')
  var websiteIsValidInput = validator.isURL(website, {protocols: ['http','https'], require_protocol: true})
  
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

  //validate data admin only params
  var barNameIsValidInput = false
  var cityIsValidInput = false
  if ((userRole == 'administrator' || userRole == 'reviewer') && userRole != 'barOwner') {
  	barName = validator.blacklist(barName, '()')
  	barNameIsValidInput = validator.isAlphanumeric(barName)

    city = validator.blacklist(city, '()')
    cityIsValidInput = validator.matches(city, /^[A-Za-z ]*,[ ]?[A-Za-z]*$/)
  }

  if (barIdIsValidLength && barIdIsValidInput && (addressIsValidInput || !address) && (phoneNumberIsValidInput || !phoneNumber) && (websiteIsValidInput || !website) && ((categoriesIsValidInput && categoryIsValid) || !categories) && (photosIsValidInput || !photos) && (barNameIsValidInput || !barName)) {
  	//query
  	var theBar = Bar.findById(barId, function(err, results) {
  		if (err) {console.log(err)}
  		if (results) {
  			//edit the bar information
  			if (address) {results.address = address}
  			if (phoneNumber) {results.phoneNumber = phoneNumber}
  			if (website) {results.websiteURL = website}
  			if (categories) {results.categories = categoriesArray}
  			if (photos) {results.photos = photosArray}
  			if (barName && (userRole == 'administrator' || userRole == 'reviewer')) {results.barName = barName}
        if (city && (userRole == 'administrator' || userRole == 'reviewer')) {results.city = city}

  			//save bar to database
  			results.save(function (err, saved, numberAffected) {
		  		if (err) {console.log(err)}
		  		if (saved) {
		  			var success = false
		  			if (numberAffected == 1) {
		 				success = true
		  			}
		  			res.json({"success": success})
		  		}
	  		}) 
  		} else {
  			//console.log('No results found')
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//Not valid input
  	res.json({ "error": "Input Not Valid"})
  }
}
