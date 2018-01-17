module.exports = function (sequelize, DataTypes) {
  return sequelize.define('house', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    housename: { type: DataTypes.STRING(200), allowNull: true, comment: '房屋名称' },
    designdata: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'house',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}