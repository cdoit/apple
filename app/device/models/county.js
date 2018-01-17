module.exports = function (sequelize, DataTypes) {
  return sequelize.define('County', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    countyname: { type: DataTypes.STRING, allowNull: false, comment: '区名称' },
    countyid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '区编码' },
    fatherid: { type: DataTypes.BIGINT(11), allowNull: true, comment: '市编码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'county',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}