var seneca = require('seneca')()
seneca.use('mongo-store', {
  uri: 'mongodb://120.0.0.1:27017/dbname'
})
.use("entity")

seneca.ready(function () {
  var apple = seneca.make$('fruit')
  apple.name  = 'Pink Lady'
  apple.price = 0.99
  apple.save$(function (err,apple) {
    console.log( "apple.id = "+apple.id  )
  })
})