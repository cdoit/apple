module.exports = function (sequelize, DataTypes) {
  return sequelize.define('City', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    cityname: { type: DataTypes.STRING, allowNull: false, comment: '市名称' },
    cityid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '市编码' },
    fatherid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '省编码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'city',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}