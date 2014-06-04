
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var FeedbackSchema = new Schema({ 
	type : String, 
	user : String, /*user id */
	category: String,
	dateSubmitted : String,
	detailedFeedback : String,
	additionalFields : {} 
})

/**
 * User plugin
 */

//FeedbackSchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

FeedbackSchema.method({

})

/**
 * Statics
 */

FeedbackSchema.static({

})

/**
 * Register
 */

mongoose.model('Feedback', FeedbackSchema, 'Feedback')
