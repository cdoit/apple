// 房屋方案
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('houseplan', {
    id: { type: DataTypes.STRING(200), primaryKey: true, unique: true },
    houseid: {
      type: DataTypes.STRING(200),
      allowNull: false,
      comment: '房屋（项目）Id'
    },
    planname: { type: DataTypes.STRING(200), allowNull: true, comment: '方案名称' },
    room: { type: DataTypes.STRING(200), allowNull: true, comment: '房间' },
    part: { type: DataTypes.STRING(200), allowNull: true, comment: '房间部分' },
    materialpackge: { type: DataTypes.STRING(200), allowNull: true, comment: '物料包' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'houseplan',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}