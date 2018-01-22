module.exports = function (sequelize, DataTypes) {
  return sequelize.define('supply', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    supplybookId: {
      field: 'supplybook_id',
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '供应商Id'
    },
    materialId: {
      field: 'material_id',
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '物料Id'
    },
    supplyname: { type: DataTypes.STRING(200), allowNull: true, comment: '供应商名称' },
    unit: { type: DataTypes.STRING(200), allowNull: true, comment: '单位' },
    supplyprice: { type: DataTypes.STRING(200), allowNull: true, comment: '价格' },
    categoryid: { type: DataTypes.STRING(200), allowNull: true, comment: '分类' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'supply',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}