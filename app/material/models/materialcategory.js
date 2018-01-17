module.exports = function (sequelize, DataTypes) {
  return sequelize.define('materialcategory', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    name: { type: DataTypes.STRING(200), allowNull: true, comment: '名称' },
    codelength: { type: DataTypes.BIGINT(6), allowNull: true, comment: '编码长度' },
    parentid: { type: DataTypes.STRING(200), allowNull: true, comment: '父节点' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'materialcategory',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}