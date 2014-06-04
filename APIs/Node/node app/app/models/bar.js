
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var BarSchema = new Schema({ 
	barName : { type: String, default: '' }, 
	size : { type: String, default: '' }, 
	cost : { type: String, default: '' }, 
	city : { type: String },
	address : { type: String, default: '' }, 
	loc : { 
		type: Object, 
		coordinates: Object 
	}, 
	photos : { type: Array, default: '' },  
	categories : { type: Array, default: '' }, 
	overallRating : { type: Number, min: 0, max: 100 }, 
	negativeVotes : { type: Number, default: '' }, 
	websiteURL : { type: String, default: '' }, 
	positiveVotes : { type: Number, default: '' },
	phoneNumber : String,
	averageRatings : { 
		key: String
	}
})

/**
 * User plugin
 */

//BarSchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

BarSchema.method({

})

/**
 * Statics
 */

BarSchema.static({

})

/**
 * Register
 */

mongoose.model('Bar', BarSchema, 'Bar')
