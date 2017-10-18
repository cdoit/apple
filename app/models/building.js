module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Building', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    name: { type: DataTypes.STRING(255), allowNull: true, comment: '楼盘名称' },
    address: { type: DataTypes.STRING(255), allowNull: true, comment: '地址' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    provinceId: { type: DataTypes.BIGINT(11), allowNull: true, comment: '所属省' },
    cityId: { type: DataTypes.BIGINT(11), allowNull: true, comment: '所属市' },
    countyId: { type: DataTypes.BIGINT(11), allowNull: true, comment: '所属区' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'building',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}