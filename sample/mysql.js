const Sequelize = require('sequelize');
const sequelize = new Sequelize('test', 'zj', 'zj');

const User = sequelize.define('fruit', {
  name: Sequelize.STRING,
  price: Sequelize.FLOAT
});

sequelize.sync()
  .then(() => User.create({
    name: 'janedoe',
    price: 11
  }))
  .then(jane => {
    console.log(jane.get({
      plain: true
    }));
  });