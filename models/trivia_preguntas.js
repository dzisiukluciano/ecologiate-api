'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_Preguntas = sequelize.define('trivia_Preguntas', {
    id: { type: DataTypes.INT, primaryKey: true, autoIncrement: true },
    description : { type: DataTypes.STRING }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //trivia_Preguntas.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.trivia_Preguntas);
      }
    }
  });
  return trivia_Preguntas;
};