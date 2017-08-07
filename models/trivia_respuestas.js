'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_Respuestas = sequelize.define('trivia_Respuestas', {
    id: { type: DataTypes.INT, primaryKey: true, autoIncrement: true },
    id_pregunta: { type: DataTypes.INT },
    respuesta : { type: DataTypes.STRING },
	correcta: { type: DataTypes.STRING, defaultValue: false}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //trivia_Respuestas.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.trivia_Respuestas);
      }
    }
  });
  return trivia_Respuestas;
};