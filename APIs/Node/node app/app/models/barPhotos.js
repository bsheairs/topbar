
/*!
 * Module dependencies
 */

var mongoose = require('mongoose')
var Schema = mongoose.Schema

/**
 * User schema
 */

var BarPhotosSchema = new Schema({ 
	barId : { type: String, default: '' }, 
	imageURL : { type: String, default: '' }
})

/**
 * User plugin
 */

//BarPhotosSchema.plugin(userPlugin, {})

/**
 * Add your
 * - pre-save hooks
 * - validations
 * - virtuals
 */

/**
 * Methods
 */

BarPhotosSchema.method({

})

/**
 * Statics
 */

BarPhotosSchema.static({

})

/**
 * Register
 */

mongoose.model('BarPhotos', BarPhotosSchema, 'BarPhotos')
