module.exports = function (sequelize, DataTypes) {
    return sequelize.define('Function', {
        id: { type: DataTypes.STRING(100),  primaryKey: true, unique: true },
        parent: { type: DataTypes.STRING(100), allowNull: true, comment: '父id' },
        functionname: { type: DataTypes.STRING(100), allowNull: true, comment: '权限名称' },
        functionsn: { type: DataTypes.STRING(100), allowNull: true, comment: '权限编码' },
        url: { type: DataTypes.STRING(255), allowNum: true, comment: '动作地址' },
        funcs: { type: DataTypes.STRING(180), allowNull: true, comment: '权限编码' },
        functiontype: { type: DataTypes.STRING(100), allowNull: true, comment: '权限类型' },
        priority: { type: DataTypes.BIGINT(11), allowNull: true, comment: '排序' },
        ismenu: { type: DataTypes.BOOLEAN, allowNull: true, comment: '是否为菜单' }
    },
        {
            timestamps: true,
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            tableName: 'function',
            charset: 'utf8',
            collate: 'utf8_general_ci'
        });
}