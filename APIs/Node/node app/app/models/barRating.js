
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var BarRatingSchema = new Schema({ 
	barId : { type: String, default: '' }, 
	dateSubmitted : { type: Number, default: '' }, 
	ratingValue : { type: Number, default: '' }
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

BarRatingSchema.method({

})

/**
 * Statics
 */

BarRatingSchema.static({

})

/**
 * Register
 */

mongoose.model('BarRating', BarRatingSchema, 'BarRating')
