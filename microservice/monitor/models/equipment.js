//设备
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Equipment', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    name: { type: DataTypes.STRING(20), allowNull: true, comment: '设备名称' },
    code: { type: DataTypes.STRING(20), allowNull: true, comment: '设备编码' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    warrantyperiod: { type: DataTypes.STRING(11), allowNull: true, comment: '保修期' },
    customer: { type: DataTypes.STRING(11), allowNull: true, comment: '购买人' },
    state: { type: DataTypes.STRING(11), allowNull: true, comment: '状态' },
    workstate: { type: DataTypes.STRING(11), allowNull: true, comment: '工作状态' },
    buytime: { type: DataTypes.DATE, allowNull: true, comment: '购买时间' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'equipment',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}