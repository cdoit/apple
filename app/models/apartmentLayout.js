module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ApartmentLayout', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    buildingId: {
      type: DataTypes.STRING(100),
      field: 'building_id',
      allowNull: false,
      comment: '楼盘Id'
    },
    name: { type: DataTypes.STRING(255), allowNull: true, comment: '户型名称' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    roomcount: { type: DataTypes.BIGINT(10), allowNull: true, comment: '房间数' },
    hallcount: { type: DataTypes.BIGINT(11), allowNull: true, comment: '厅 数' },
    kitchencount: { type: DataTypes.BIGINT(11), allowNull: true, comment: '厨房数' },
    wccount: { type: DataTypes.BIGINT(11), allowNull: true, comment: '卫生间  数' },
    floorheight: { type: DataTypes.STRING(255), allowNull: true, comment: '层高' },
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'apartmentLayout',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}