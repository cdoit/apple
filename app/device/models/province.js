module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Province', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    provincename: { type: DataTypes.STRING, allowNull: false, comment: '省名称' },
    provinceid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '省编码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'province',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}