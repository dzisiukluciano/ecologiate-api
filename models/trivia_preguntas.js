'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_preguntas = sequelize.define('trivia_preguntas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING },
  	explicacion : { type: DataTypes.STRING },
  	imagen : { type: DataTypes.STRING }
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
  return trivia_preguntas;
};