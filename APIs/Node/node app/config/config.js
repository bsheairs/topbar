
/*!
 * Module dependencies.
 */

var path = require('path')
var rootPath = path.resolve(__dirname + '../..')

/**
 * Expose config
 */

module.exports = {
  development: {
    root: rootPath,
    db: 'mongodb://datakitTest:datakit123@localhost:27017/dataKitTest'
  },
  test: {
    root: rootPath,
    db: 'mongodb://datakitTest:datakit123@localhost:27017/dataKitTest'
  },
  staging: {
    root: rootPath,
    db: process.env.MONGOHQ_URL
  },
  production: {
    root: rootPath,
    db: process.env.MONGOHQ_URL
  }
}
