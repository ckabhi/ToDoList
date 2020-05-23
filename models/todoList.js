module.exports = function(sequelize, Sequelize){
    var ListSchema = sequelize.define('ToDoList', {
        userId: Sequelize.INTEGER,
        title: Sequelize.STRING,
        date: Sequelize.DATE,
        status: Sequelize.BOOLEAN
    },{
        timestamp: true
    });
    return ListSchema;
}