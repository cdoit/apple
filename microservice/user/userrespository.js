exports.add = function (msg, respond) {
    var db =require('../../config/dbengine');
    const Sequelize = require('sequelize');
    var dbinstance=new db();
    dbinstance.consqldb();
    const sequelize =dbinstance.sqldb;
    const User = sequelize.define('user', {
      uniqueId: {
        type: Sequelize.STRING,
        allowNull: false,         
        unique: true              
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false                   
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false                  
      }
    });
    User.sync({force: false}).then(() => {
        User.create(msg);
    });

    var item = User.build(msg);
    item =  item.save();
    return true;
};

exports.deleteById = function (Id, respond) {
    var db =require('../../config/dbengine');
    const Sequelize = require('sequelize');
    var dbinstance=new db();
    dbinstance.consqldb();
    const sequelize =dbinstance.sqldb;
    const User = sequelize.define('user', {
      uniqueId: {
        type: Sequelize.STRING,
        allowNull: false,         
        unique: true              
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: false                   
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: false                  
      }
    });
    User.sync({force: false}).then(() => {
        User.create(msg);
    });

    var item = User.destroy({'where': {'id': [Id]}});
    return true;
};