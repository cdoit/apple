//系统日志表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Systemlog', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    ip: { type: DataTypes.STRING(100), allowNull: true, comment: 'ip' },
    loginfo: { type: DataTypes.STRING(100), allowNull: true, comment: '日志详情' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'systemlog',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}