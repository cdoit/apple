//产品对应的平面图
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Photo', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    productId: {
      type: DataTypes.BIGINT(11),
      field: 'product_id',
      allowNull: false,
      // references: {
      //   model: 'Product',
      //   key: 'id'
      // },
      comment: '产品Id'
    },
    imgtype: { type: DataTypes.STRING(100), allowNull: true, comment: '图片类型' },
    imgurl: { type: DataTypes.STRING(100), allowNull: true, comment: '图片路劲' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'photo',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}