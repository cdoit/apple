//设备
module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Equipment', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    name: { type: DataTypes.STRING(20), allowNull: true, comment: '设备名称' },
    // MAC地址
    code: { type: DataTypes.STRING(20), allowNull: true, comment: '设备编码' },
    priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
    warrantyperiod: { type: DataTypes.STRING(11), allowNull: true, comment: '保修期' },
    customer: { type: DataTypes.STRING(11), allowNull: true, comment: '购买人' },
    state: { type: DataTypes.STRING(11), allowNull: true, comment: '状态' },
    workstate: { type: DataTypes.STRING(11), allowNull: true, comment: '工作状态' },
    buytime: { type: DataTypes.DATE, allowNull: true, comment: '购买时间' },

    // latitude: { type: DataTypes.STRING(20), allowNull: true, comment: '纬度' },
    // longitude: { type: DataTypes.STRING(20), allowNull: true, comment: '经度' },
    // elevation: { type: DataTypes.STRING(11), allowNull: true, comment: '高程' },

    firststartdate: { type: DataTypes.DATE, allowNull: true, comment: '第一次开机时间' },
    startdate: { type: DataTypes.DATE, allowNull: true, comment: '最近开机时间' },
    worktimes: { type: DataTypes.STRING(11), allowNull: true, comment: '设备运行时长' },
    output: { type: DataTypes.STRING(11), allowNull: true, comment: '设备总的产量（长度）' },
    cuttingtimes: { type: DataTypes.STRING(11), allowNull: true, comment: '设备切刀总次数' },
    // 暂定
    project: { type: DataTypes.STRING(11), allowNull: true, comment: '设备当前项目' }
  },
    {
      timestamps: true,
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      tableName: 'equipment',
      charset: 'utf8',
      collate: 'utf8_general_ci'
    });
}