'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_opcion = sequelize.define('trivia_opcion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    opcion: { type: DataTypes.STRING } //Tacho Verde, Tacho Negro, Compostera, Manejo Especial
  });
  return trivia_opcion;
};