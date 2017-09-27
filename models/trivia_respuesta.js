'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respuesta = sequelize.define('trivia_respuesta', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    respuesta: { type: DataTypes.STRING } //Tacho Verde, Tacho Negro, Compostera, Manejo Especial
  });
  return trivia_respuesta;
};