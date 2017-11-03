'use strict'
var Seneca = require('seneca')();
const db = require("./db/");
db.init();

function approver () {
  this.add('role:math, cmd:sum', (msg, reply) => {
    db.Equipment.findAll().then(function (result) {
    reply(null, result)
  });
    
  })
}

function getProject () {
  this.add('role:project, cmd:getProject', (msg, reply) => {
    var equipmentCode = msg.left;
    db.Sequelize.query(
      "SELECT p.* from equipment as e JOIN project as p ON e.id = p.equipment_id where e.`code` = '"+equipmentCode+"'"
    ).then(function (result) {
    reply(null, result[0])
  });
    
  })
}

Seneca
  .use(approver)
  .use(getProject)
  .listen({type: 'tcp', port: '8000', pin: 'cmd:*'})