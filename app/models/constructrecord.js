//项目对应的施工过程信息  
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Constructrecord', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    orderId: {
      type: DataTypes.STRING(100),
      field: 'order_id',
      allowNull: false,
      comment: '订单（项目）Id'
    },
    content: { type: DataTypes.STRING(100), allowNull: true, comment: '工作内容' },
    imgurl: { type: DataTypes.STRING(100), allowNull: true, comment: '图片路劲' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'constructrecord',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}