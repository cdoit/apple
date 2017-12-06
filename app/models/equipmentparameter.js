//设备参数
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Equipmentparameter', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    equipmentId: {
      type: DataTypes.STRING(100),
      field: 'equipment_id',
      allowNull: false,
      comment: '设备Id'
    },
    
    temperature: { type: DataTypes.STRING(11), allowNull: true, comment: '温度' },
    humidity: { type: DataTypes.STRING(11), allowNull: true, comment: '湿度' },
    supplies: { type: DataTypes.STRING(11), allowNull: true, comment: '喷墨耗材用量' },
    speed: { type: DataTypes.STRING(11), allowNull: true, comment: '设备运行速度' },
    workstate: { type: DataTypes.STRING(11), allowNull: true, comment: '运行状态' },
    oilpressure: { type: DataTypes.STRING(11), allowNull: true, comment: '设备油压' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'equipmentparameter',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}