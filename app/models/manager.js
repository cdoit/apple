//用于建立管理员的表，管理员通过账号和密码登陆

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Manager', {
        managerid: {
            type: DataTypes.BIGINT(11),
            primaryKey: true,
            unique: true,
            autoIncrement: true,
            allowNull: false,
            comment: '管理员的id信息'
        },
        username: {
            type: DataTypes.STRING,
            allowNull: true,
            comment: '管理员的登陆名'
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            defaultValue: true,
            comment: '管理员的密码'
        },
        roleid: {
            type: DataTypes.BIGINT(11),
            allowNull: true,
            comment: '管理员的角色'
        },
    },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'manager',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
}