module.exports = function (sequelize, DataTypes) {
  return sequelize.define('HistorySearch', {
    id: { type: DataTypes.STRING(100), primaryKey: true, unique: true },
    userId: {
      type: DataTypes.BIGINT(11),
      field: 'user_id',
      allowNull: false,
      // references: {
      //   model: 'User',
      //   key: 'id'
      // },
      comment: '用户Id'
    },

    buildingId: {
      type: DataTypes.BIGINT(11),
      field: 'building_id',
      allowNull: false,
      // references: {
      //   model: 'Building',
      //   key: 'id'
      // },
      comment: '楼盘Id'
    },

    searchCount: { 
      field: 'search_count',
      type: DataTypes.BIGINT(11), 
      allowNull: true,
      defaultValue: 1,
       comment: '搜索次数' 
      }
    
  },
    {
      underscored: true,
      timestamps: true,
      tableName: 'historySearch',
      comment: '用户搜索信息',
      charset: 'utf8',
      collate: 'utf8_general_ci'
      // indexes: [{
      //   name: 'historySearch_userId',
      //   method: 'BTREE',
      //   fields: ['user_id']
      // },
      // {
      //   name: 'historySearch_buildingId',
      //   method: 'BTREE',
      //   fields: ['building_id']
      // }]
    });
}