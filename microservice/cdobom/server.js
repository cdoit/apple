'use strict'
var Seneca = require('seneca')();

function approver () {
  this.add('role:math, cmd:sum', (msg, reply) => {
    reply(null, { answer: ( msg.left + msg.right )})
  })
}

Seneca
  .use(approver)
  .listen({type: 'tcp', port: '8001', pin: 'cmd:*'})