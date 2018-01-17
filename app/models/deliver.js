module.exports = function (sequelize, DataTypes) {
  return sequelize.define('deliver', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    storeid: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '库存Id'
    },
    delivername: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' },
    delivernum: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'deliver',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}