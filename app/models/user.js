module.exports = function (sequelize, DataTypes) {
  return sequelize.define('User', {
    id: { type: DataTypes.BIGINT(11), primaryKey: true,autoIncrement: true },
    // id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    username: { type: DataTypes.STRING, allowNull: true, comment: '用户名' },
    password: { type: DataTypes.STRING, allowNull: true, comment: '用户密码' },
    mobile: { type: DataTypes.STRING, allowNull: true, comment: '用户的手机号' },
    openid: { type: DataTypes.STRING, allowNull: false, comment: '用户的微信id' },
    sponsor: { type: DataTypes.STRING, allowNull: false, comment: '当前用户的发起人' },
    roleid: { field: 'role_id', type: DataTypes.BIGINT(11),allowNull: false,  comment: '当前用户的角色' },
    active: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false, comment: '是否正常状态' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'user',
      charset: 'utf8',
      collate: 'utf8_general_ci'
      // indexes: [{
      //   name: 'user_roleId',
      //   method: 'BTREE',
      //   fields: ['role_id']
      // }]
    });
}