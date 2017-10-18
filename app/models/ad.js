//广告
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Ad', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    name: { type: DataTypes.STRING(100), allowNull: true, comment: '图片名称' },
    url: { type: DataTypes.STRING(100), allowNull: true, comment: '跳转链接' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    imgurl: { type: DataTypes.STRING(100), allowNull: true, comment: '图片路劲' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'ad',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}