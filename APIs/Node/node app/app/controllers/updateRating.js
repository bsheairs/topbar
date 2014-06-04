
/*!
 * Module dependencies.
 */

/*
*	Psuedo-code:
*	Check uauthentication and session.
*	if valid, continue; otherwise authenticate
*	take in rating parameter and barId.
*	Run the algo to update the bar's rating
*	return bool if action was sucessful
*	check for errors
*/

exports.index = function (req, res) {
  res.json({ user: req.param('id') })
}
