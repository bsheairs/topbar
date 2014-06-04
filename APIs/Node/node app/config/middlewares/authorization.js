
/*
 *  Generic require login routing middleware
 */

exports.requiresLogin = function (req, res, next) {
  if (req.isAuthenticated()) return next()
  if (req.method == 'GET') req.session.returnTo = req.originalUrl
  res.redirect('/login')
}

/*
 *  User authorization routing middleware
 *  TODO
 */

exports.user = { //NEEDS TO BE UPDATED
  hasAuthorization: function (req, res, next) {
    if (req.profile.id != req.user.id) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
*
* Authorization checks to implement
* var userAuth = [auth.requiresLogin, auth.user.hasAuthorization]
* var addBarAuth = [auth.requiresLogin, auth.addBar.hasAuthorization]
* var addUserPointsAuth = [auth.requiresLogin, auth.addUserPoints.hasAuthorization]
* var removeBarAuth = [auth.requiresLogin, auth.removeBar.hasAuthorization]
* var editBarAuth = [auth.requiresLogin, auth.editBar.hasAuthorization]
*/

/*
 *  AddBar authorization routing middleware
 *  
 */

exports.addBar = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'iOS') && (req.user.userRole != 'reviewer') && (req.user.userRole != 'administrator')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Add User Points authorization routing middleware
 *  
 */

exports.addUserPoints = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'iOS') && (req.user.userRole != 'administrator')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Remove bar authorization routing middleware
 *  
 */

exports.removeBar = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'administrator') && (req.user.userRole != 'reviewer')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Edit Bar authorization routing middleware
 *  
 */

exports.editBar = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'administrator') && (req.user.userRole != 'reviewer') && (req.user.userRole != 'barOwner')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Remove comment authorization routing middleware
 *  
 */

exports.removeComment = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'administrator') && (req.user.userRole != 'reviewer')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Submit Feedback authorization routing middleware
 *  
 */

exports.submitFeedback = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'iOS') && (req.user.userRole != 'barOwner') && (req.user.userRole != 'marketResearcher')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Get Feedback authorization routing middleware
 *  
 */

exports.getFeedback = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'administrator') && (req.user.userRole != 'reviewer')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Get BarRatings authorization routing middleware
 *  
 */

exports.getBarRatings = {
  hasAuthorization: function (req, res, next) {
    if ((req.user.userRole != 'barOwner') && (req.user.userRole != 'marketResearcher')) {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Get modifyUser authorization routing middleware
 *  
 */

exports.modifyUser = {
  hasAuthorization: function (req, res, next) {
    if (req.user.userRole != 'administrator') {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}

/*
 *  Get editUser authorization routing middleware
 *  
 */

exports.editUser = {
  hasAuthorization: function (req, res, next) {
    if (req.user.userRole != 'administrator' && req.user.userRole != 'barOwner' && req.user.userRole != 'marketResearcher') {
      req.flash('info', 'You are not authorized')
      return res.status('403').render('403')
    }
    next()
  }
}