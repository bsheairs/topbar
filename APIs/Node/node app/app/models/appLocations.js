
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var AppLocationsSchema = new Schema({ 
	id : { type: String}, 
	city : { type: String}, 
	loc : { 
		type: Object, 
		coordinates: Object
	},
	radius: {type: Number}
})

/**
 * User plugin
 */

//RatingSchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

AppLocationsSchema.method({

})

/**
 * Statics
 */

AppLocationsSchema.static({

})

/**
 * Register
 */

mongoose.model('AppLocations', AppLocationsSchema, 'AppLocations')
