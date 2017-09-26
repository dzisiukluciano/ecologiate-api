'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_pregunta = sequelize.define('trivia_pregunta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING },
  	explicacion : { type: DataTypes.STRING },
  	imagen : { type: DataTypes.STRING }
  });
  trivia_pregunta.associate = function (models) {
    //esto me crea la columna pregunta_id en trivia_respondida, y la lista de respuestas_usuarios en este model
    trivia_pregunta.hasMany(models.trivia_respondida, {as: 'respuestas_usuarios', foreignKey: 'pregunta_id'});
    //esto me crea la columna pregunta_id en trivia_respuesta, y la lista de respuestas en este model
    trivia_pregunta.hasMany(models.trivia_respuesta, {as: 'respuestas', foreignKey: 'pregunta_id'});
  };
  return trivia_pregunta;
};