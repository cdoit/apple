//数据字典表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Dictionary', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    dictleble: { type: DataTypes.STRING(100), allowNull: true, comment: '字典leble' },
    dictvalue: { type: DataTypes.STRING(100), allowNull: true, comment: '字典值' },
    dicttype: { type: DataTypes.STRING(100), allowNull: true, comment: '字典类型' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'dictionary',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}