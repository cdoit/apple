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
    length: { type: DataTypes.STRING(20), allowNull: true, comment: '长度' },
    width: { type: DataTypes.STRING(20), allowNull: true, comment: '宽度' },
    height: { type: DataTypes.STRING(11), allowNull: true, comment: '高度' },
    weight: { type: DataTypes.STRING(11), allowNull: true, comment: '重量' },
    material: { type: DataTypes.STRING(11), allowNull: true, comment: '材质' },
    temperature: { type: DataTypes.STRING(11), allowNull: true, comment: '温度' },
    humidity: { type: DataTypes.STRING(11), allowNull: true, comment: '湿度' }
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