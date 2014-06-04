
/*!
 * Module dependencies.
 */

 var mongoose = require('mongoose')
 var User = mongoose.model('User')
 var Bar = mongoose.model('Bar')
 var crypto = require('crypto')
 var Random = require('random-js')
 var validator = require('validator')

exports.index = function (req, res) {
  /*var user = User.findOne({'firstName': 'Brendan'}, function(err, user) {
  	console.log('looking...')
  	if (err) { console.log(err) }
    if (user) {
    	console.log(user.email)
    	if (!user.hashedPassword) return ''
    	var encrypred
    	try {
      		encrypred = crypto.createHmac('sha1', user.salt).update(user.hashedPassword).digest('hex')
      		res.json({'encrypred' : encrypred})
    	} catch (err) {
      		res.json({ 'err': err})
    	}
    } else {
    	console.log('no users found')
    } 
  })*/

  /*var theBar = Bar.findOne({'barName': 'Wahaca'}, function(err, bar) {
    console.log('looking...')
    if (err) { console.log(err) }
    if (bar) {
      console.log(bar)
      console.log(bar.loc.coordinates[0])
      console.log(bar.loc.coordinates[1])
    } else {
      console.log('no users found')
    } 
  })*/

  var randomGenerator = new Random(Random.engines.mt19937().autoSeed())
  
  var result = randomGenerator.string(32)

  var param = req.param('a')

  var paramDateValidate = validator.isDate(param)
  var time = Date.parse(param)

  res.json({ 'time': time,'validDate': paramDateValidate,'random': result, "param" : param, "username": req.user, "session": req.session, "user": req.user.id, "sessionId": req.sessionID})
}