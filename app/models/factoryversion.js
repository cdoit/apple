//设备出厂信息
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Factoryversion', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    equipmentId: {
      type: DataTypes.STRING(100),
      field: 'equipment_id',
      allowNull: false,
      comment: '设备Id'
    },
    factoryname: { type: DataTypes.STRING(20), allowNull: true, comment: '厂家名称' },
    address: { type: DataTypes.STRING(50), allowNull: true, comment: '厂家地址' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '供货等级' },
    phonenumber: { type: DataTypes.STRING(11), allowNull: true, comment: '保修期' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'factoryversion',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}