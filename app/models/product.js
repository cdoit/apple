module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Product', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    apartmentLayoutId: {
      type: DataTypes.STRING(100),
      field: 'apartmentLayout_id',
      allowNull: false,
      comment: '户型Id'
    },
    name: { type: DataTypes.STRING(255), allowNull: true, comment: '产品名称' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    loopimags: { type: DataTypes.STRING(255), allowNull: true, comment: '轮播图' },
    price: { type: DataTypes.STRING(100), allowNull: true, comment: '价格' },
    space: { type: DataTypes.STRING(110), allowNull: true, comment: '空间利用率' },
    area: { type: DataTypes.STRING(100), allowNull: true, comment: '改造前面积' },
    targetsize: { type: DataTypes.STRING(100), allowNull: true, comment: '改造后面积' },
    safeparam: { type: DataTypes.STRING(100), allowNull: true, comment: '安全参数' },
    antiseismic: { type: DataTypes.STRING(100), allowNull: true, comment: '抗压强度' },
    plan: { type: DataTypes.STRING(100), allowNull: true, comment: '平面图' },
    notice: { type: DataTypes.STRING(200), allowNull: true, comment: '优惠、降价等信息' },
    category: { type: DataTypes.STRING(200), allowNull: true, comment: '' },
    constructtime: { type: DataTypes.STRING(100), allowNull: true, comment: '施工时间' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'product',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}