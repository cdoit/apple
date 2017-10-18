'use strict'
var Seneca = require('seneca')

function approver () {
  this.add('cmd:run', (msg, done) => {
    return done(null, {tag: 'approver'})
  })
}

Seneca()
  .use(approver)
  .listen({type: 'tcp', port: '8000', pin: 'cmd:*'})