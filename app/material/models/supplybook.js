// 供应商
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('supplybook', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    supplyname: { type: DataTypes.STRING(200), allowNull: true, comment: '供应商名称' },
    pepole: { type: DataTypes.STRING(200), allowNull: true, comment: '人数' },
    address: { type: DataTypes.STRING(200), allowNull: true, comment: '地址' },
    billtype: { type: DataTypes.STRING(200), allowNull: true, comment: '票据类型' },
    operatscope: { type: DataTypes.STRING(200), allowNull: true, comment: '经营范围' },
    cooperationtime: { type: DataTypes.STRING(200), allowNull: true, comment: '合作时长' },
    tel: { type: DataTypes.STRING(200), allowNull: true, comment: '电话号码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'supplybook',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}