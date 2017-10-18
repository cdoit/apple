'use strict'
var Seneca = require('seneca')

function rejector () {
  this.add('cmd:run', (msg, done) => {
    return done(null, {tag: 'rejector'})
  })
}

function approver () {
  this.add('cmd:run', (msg, done) => {
    return done(null, {tag: 'approver'})
  })
}

function local () {
  this.add('cmd:run', function (msg, done) {
    this.prior(msg, (err, reply) => {
      return done(null, {tag: reply ? reply.tag : 'local'})
    })
  })
}

Seneca()
  .use(approver)
  .use(local)
  .listen({type: 'tcp', port: '8270', pin: 'cmd:*'})


// // function handler (err, reply) {
// //   console.log(err, reply)
// // }

// // Seneca()
// //   .client({port: 8270, pin: 'cmd:run'})
// //   //.use(local)
// //   .act('cmd:run', handler)
// require('seneca')()
//   .use('basic')
//   .use('entity')
//   .use('book-store')
//   .listen({
//     port: 9002,
//     pin: 'role:store'
//   })
//   .client({
//     port: 9003,
//     pin: 'role:store,info:purchase'
//   });