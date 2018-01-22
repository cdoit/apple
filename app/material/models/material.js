module.exports = function (sequelize, DataTypes) {
  return sequelize.define('material', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    materialcategoryid: {
      field: 'materialcategory_id',
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '类型Id'
    },
    name: { type: DataTypes.STRING(200), allowNull: true, comment: '名称' },
    unit: { type: DataTypes.STRING(200), allowNull: true, comment: '单位' },
    attributeinfo: { type: DataTypes.STRING(2000), allowNull: true, comment: ' ' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'material',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}