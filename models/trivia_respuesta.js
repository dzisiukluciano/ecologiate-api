'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respuesta = sequelize.define('trivia_respuesta', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    respuesta : { type: DataTypes.STRING },
    correcta: { type: DataTypes.BOOLEAN, defaultValue: false}
  });
  trivia_respuesta.associate = function (models) {
    //esto me agrega la columna pregunta_id a la tabla, y el atributo pregunta al model
    trivia_respuesta.belongsTo(models.trivia_pregunta, {as: 'pregunta'});
  };
  return trivia_respuesta;
};