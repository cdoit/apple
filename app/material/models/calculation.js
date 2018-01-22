module.exports = function (sequelize, DataTypes) {
  return sequelize.define('calculation', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    materialid: {
      type: DataTypes.STRING(200),
      field: 'material_id',
      allowNull: false,
      comment: '物料Id'
    },
    name: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' },
    projectid: { type: DataTypes.STRING(200), allowNull: true, comment: '' },
    packgeid: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' },
    num: { type: DataTypes.STRING(200), allowNull: true, comment: ' ' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'calculation',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}