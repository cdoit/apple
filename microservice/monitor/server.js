'use strict'
var Seneca = require('seneca')

function local () {
  Seneca().add('role:math,cmd:sum', (msg, reply) => {
    reply(null, {answer: (msg.left + msg.right)})
  })
}

Seneca()
  .use(local)
  .listen({type: 'tcp', port: '8270', pin: 'cmd:*'})