
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var RatingSchema = new Schema({ 
	barId : { type: String, default: '' }, 
	userId : { type: String, default: '' }, 
	dateSubmitted : { type: String, default: '' }, 
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

RatingSchema.method({

})

/**
 * Statics
 */

RatingSchema.static({

})

/**
 * Register
 */

mongoose.model('Rating', RatingSchema, 'Rating')
