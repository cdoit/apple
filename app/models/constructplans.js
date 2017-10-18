//项目对应的施工图
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Constructplans', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    orderId: {
      type: DataTypes.STRING(100),
      field: 'order_id',
      allowNull: false,
      comment: '订单（项目）Id'
    },
    imgtype: { type: DataTypes.STRING(100), allowNull: true, comment: '图片类型' },
    imgurl: { type: DataTypes.STRING(100), allowNull: true, comment: '图片路劲' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'constructplans',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}