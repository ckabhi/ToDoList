module.exports = function(sequelize, Sequelize){
    var ListSchema = sequelize.define('ToDoList', {
        userId: Sequelize.INTEGER,
        title: Sequelize.STRING,
        date: Sequelize.DATEONLY,
        status: Sequelize.BOOLEAN,
        type: Sequelize.CHAR(255),
    },{
        timestamp: true
    });
    return ListSchema;
}