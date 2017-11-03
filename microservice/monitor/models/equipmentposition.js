//设备位置
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Equipmentposition', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    equipmentId: {
      type: DataTypes.STRING(100),
      field: 'equipment_id',
      allowNull: false,
      comment: '设备Id'
    },
    latitude: { type: DataTypes.STRING(20), allowNull: true, comment: '纬度' },
    longitude: { type: DataTypes.STRING(20), allowNull: true, comment: '经度' },
    elevation: { type: DataTypes.STRING(11), allowNull: true, comment: '高程' },
    provinceid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '省编码' },
    cityid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '市编码' },
    countyid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '区编码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'equipmentposition',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}