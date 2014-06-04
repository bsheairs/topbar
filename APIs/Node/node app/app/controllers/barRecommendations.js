
/*!
 * Module dependencies.
 */

 /*
 *	Most likely a v2 release.
 *
 */

exports.index = function (req, res) {
  res.json({ user: req.param('id') })
}
