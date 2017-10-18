module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UserInfo', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    // id: { type: DataTypes.STRING(100), allowNull: true, comment: '主键' },
    userId: {
      type: DataTypes.BIGINT(11),
      field: 'user_id',
      unique: true,
      references: {
        model: 'User',
        key: 'id'
      },
      comment: '用户Id'
    },

    username: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '用户的真实名称'
    },
    address: {
      type: DataTypes.STRING,
      allowNull: true,
      comment: '用户的地址信息'
    },
    lastactivity: {
      type: DataTypes.DATE,
      allowNull: true,
      comment: '最后登陆的时间'
    },
    mail: {
      field: 'mail',
      type: DataTypes.STRING,
      allowNull: true,
      comment: '邮箱'
    },
    gender: {
      field: 'gender',
      type: DataTypes.ENUM('MALE', 'FEMALE'),
      allowNull: true,
      comment: '性别'
    },
    birth: {
      field: 'birth',
      type: DataTypes.DATE,
      allowNull: true,
      comment: '生日'
    },
    userIcon: {
      field: 'user_icon',
      type: DataTypes.STRING,
      allowNull: true,
      comment: '头像'
    },
    loginIp: { 
      type: DataTypes.STRING, 
      field: 'login_ip', 
      allowNull: true, 
      defaultValue: '', 
      validate: { isIP: true }, 
      comment: '登录IP' 
    }
  },
    {
      underscored: true,
      timestamps: true,
      tableName: 'userInfo',
      comment: '用户登录信息',
      charset: 'utf8',
      collate: 'utf8_general_ci'
      // indexes: [{
      //   name: 'userInfo_userId',
      //   method: 'BTREE',
      //   fields: ['user_id']
      // }]
    });
}