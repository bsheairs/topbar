
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var CommentSchema = new Schema({ 
	dateSubmitted : { type: String, default: '' }, 
	user : { type: String, default: '' }, /*user id */
	commentText : { type: String, default: '' }, 
	barId : { type: String, default: '' } 
})

/**
 * User plugin
 */

//CommentSchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

CommentSchema.method({

})

/**
 * Statics
 */

CommentSchema.static({

})

/**
 * Register
 */

mongoose.model('Comment', CommentSchema, 'Comment')
