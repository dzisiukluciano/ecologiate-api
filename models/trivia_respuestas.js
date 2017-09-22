'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respuestas = sequelize.define('trivia_respuestas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_pregunta: { type: DataTypes.INTEGER },
    respuesta : { type: DataTypes.STRING },
    correcta: { type: DataTypes.BOOLEAN, defaultValue: false}
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
  return trivia_respuestas;
};