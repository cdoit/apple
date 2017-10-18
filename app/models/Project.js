//用于建立管理员的表，管理员通过账号和密码登陆

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Project', {
        projectid: {
            type: DataTypes.BIGINT(11),
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            allowNull: false,
            comment: '管理员的id信息'
        }
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