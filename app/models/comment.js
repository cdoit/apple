//评论
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Comment', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    orderId: {
      type: DataTypes.BIGINT(11),
      field: 'order_id',
      allowNull: false,
      comment: '订单Id'
    },
    userId: {
      type: DataTypes.BIGINT(11),
      field: 'user_id',
      allowNull: false,
      comment: '用户Id'
    },
    productId: {
      type: DataTypes.BIGINT(11),
      field: 'product_id',
      allowNull: false,
      comment: '产品Id'
    },
    pralsecounts: { type: DataTypes.BIGINT(11), allowNull: true, comment: '评论级别' },
    comment: { type: DataTypes.STRING(255), allowNull: true, comment: '评论内容' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'comment',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}