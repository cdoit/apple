module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Company', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    companyname: { type: DataTypes.STRING, allowNull: false, comment: '公司名称' },
    companyaddress: { type: DataTypes.STRING, allowNull: false, comment: '公司地址' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'company',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}