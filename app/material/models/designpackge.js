// 设计包
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('designpackge', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    houseplanid: {
      type: DataTypes.STRING(200),
      field: 'houseplan_id',
      allowNull: false,
      comment: '方案Id'
    },
    nametype: { type: DataTypes.STRING(200), allowNull: true, comment: '房屋类型' },
    name: { type: DataTypes.STRING(200), allowNull: true, comment: '方案文件路径' },
    expression: { type: DataTypes.STRING(200), allowNull: true, comment: '公式' },
    unit: { type: DataTypes.STRING(200), allowNull: true, comment: '方案状态' },
    parentid: { type: DataTypes.STRING(200), allowNull: true, comment: '父节点' },
    materialid: { type: DataTypes.STRING(200), allowNull: true, comment: '物料编码' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'designpackge',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}