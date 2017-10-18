//产品对应的全景图
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Panorama', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    productId: {
      type: DataTypes.STRING(100),
      field: 'product_id',
      allowNull: false,
      // references: {
      //   model: 'Product',
      //   key: 'id'
      // },
      comment: '产品Id'
    },
    imgtype: { type: DataTypes.STRING(100), allowNull: true, comment: '图片类型' },
    imgurl: { type: DataTypes.STRING(100), allowNull: true, comment: '图片路劲' },
    category: { type: DataTypes.STRING(100), allowNull: true, comment: '图片分类' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'panorama',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}