module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Role', {
        id: { type: DataTypes.STRING(100),  primaryKey: true, unique: true },
        roletype: { type: DataTypes.STRING, allowNull: true, comment: '角色类型' },
        rolename: { type: DataTypes.STRING, allowNull: true, comment: '角色名称' },
        description: { type: DataTypes.STRING, allowNum: false, comment: '描述信息' }
    },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'role',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
}