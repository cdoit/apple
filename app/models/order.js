//订单
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Order', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    userId: {
      type: DataTypes.BIGINT(11),
      field: 'user_id',
      allowNull: false,
      // references: {
      //   model: 'User',
      //   key: 'id'
      // },
      comment: '用户Id'
    },

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

    adminInfoId: {
      type: DataTypes.BIGINT(11),
      field: 'adminInfo_id',
      allowNull: true,
      // references: {
      //   model: 'Admin',
      //   key: 'id'
      // },
      comment: '管理员Id'
    }
    
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'order',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}