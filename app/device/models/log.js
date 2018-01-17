//日志表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Log', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    adminId: {
      type: DataTypes.BIGINT(11),
      field: 'admin_id',
      allowNull: false,
      comment: '管理员Id'
    },
    ip: { type: DataTypes.STRING(100), allowNull: true, comment: 'ip' },
    loginfo: { type: DataTypes.STRING(100), allowNull: true, comment: '日志详情' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'log',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}