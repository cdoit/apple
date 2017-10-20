//设计
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Design', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    adminInfoId: {
      type: DataTypes.STRING(100),
      field: 'adminInfo_id',
      allowNull: false,
      comment: '创建设计的人员Id'
    },
    name: { type: DataTypes.STRING(100), allowNull: true, comment: '设计名称' },
    path: { type: DataTypes.STRING(100), allowNull: true, comment: '设计文件路径' },
    uploadtime: { type: DataTypes.DATE, allowNull: true, comment: '上传时间' },
    confirmtime: { type: DataTypes.DATE, allowNull: true, comment: '定稿时间' },
    state: { type: DataTypes.STRING(10), allowNull: true, comment: '设计状态' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'design',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}