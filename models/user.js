module.exports = function(sequelize, Sequelize){
    var userSchema = sequelize.define('User', {
        username: Sequelize.STRING,
        name: Sequelize.STRING,
        password: Sequelize.STRING
    },{
        timestamp: true
    });
    return userSchema;
}