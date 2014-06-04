
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var validator = require('validator')
 var Comment = mongoose.model('Comment')

/*
*	Psuedo-code:
*	Check user authentication and session.
*	if valid, continue; otherwise authenticate
*	remove the commentId from the database
*	check for errors
*/

exports.index = function (req, res) {
  //get parameters
  var commentId = req.param('commentid')

  //validation
  commentId = validator.blacklist(commentId, '()')
  var commentIdIsValidInput = validator.isAlphanumeric(commentId) //validate input for alphanumneric
  var commentIdIsValidLength = validator.isLength(commentId, 24, 24) //validate input for correct ObjectId length

  if (commentIdIsValidLength && commentIdIsValidInput) {
  	//query
  	var theComment = Comment.findByIdAndRemove(commentId, function(err, product) {
  		if (!err) {
  			//send response, remove successful
  			if (product) {
				res.json({ "success": "Comment Removed"})
  			} else {
  				//comment doesn't exist
  				res.json({ "error": "No Results Found"})
  			}
		} else {
  			console.log(err)
  			res.json({ "error": "No Results Found"})
  		}
  	})
  } else {
  	//Not valid input
  	res.json({ "error": "No Results Found"})
  }
}
