//项目表
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Project', {
      id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
      schemeId: {
          type: DataTypes.STRING(100),
          field: 'scheme_id',
          allowNull: true,
          comment: '方案Id'
        },
        equipmentId: {
          type: DataTypes.STRING(100),
          field: 'equipment_id',
          allowNull: true,
          comment: '设备Id'
        },
        designId: {
          type: DataTypes.STRING(100),
          field: 'design_id',
          allowNull: true,
          comment: '设计Id'
        },
        adminInfoId: {
          type: DataTypes.STRING(100),
          field: 'adminInfo_id',
          allowNull: false,
          comment: '项目创建人员Id'
        },
        designerId: {
          type: DataTypes.STRING(100),
          field: 'designer_id',
          allowNull: true,
          comment: '设计人员Id'
        },
        equipmenterId: {
          type: DataTypes.STRING(100),
          field: 'equipmenter_id',
          allowNull: true,
          comment: '分配设备人员Id'
        },
        name: { type: DataTypes.STRING(100), allowNull: true, comment: '项目名称' },
        address: { type: DataTypes.STRING(100), allowNull: true, comment: '项目地址' },
        auditstate: { type: DataTypes.STRING(10), allowNull: true, comment: '审核状态' },
        progress: { type: DataTypes.STRING(10), allowNull: true, comment: '项目进度' },
        // 1 为开始  2已开始  3生产中  4已完成  5终止
  },
      {
          timestamps: true,
          underscored: true,
          paranoid: true,
          freezeTableName: true,
          tableName: 'project',
          charset: 'utf8',
          collate: 'utf8_general_ci'
      });
}