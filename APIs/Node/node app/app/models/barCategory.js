
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var BarCategorySchema = new Schema({ 
	categoryName : { type: String, default: '' } 
})

/**
 * User plugin
 */

//BarCategorySchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

BarCategorySchema.method({

})

/**
 * Statics
 */

BarCategorySchema.static({

})

/**
 * Register
 */

mongoose.model('BarCategory', BarCategorySchema, 'BarCategory')
