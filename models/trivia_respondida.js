'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respondida = sequelize.define('trivia_respondida', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    id_sesion: { type: DataTypes.INTEGER },
    fecha: { type: DataTypes.DATE }
  }, 
  {
    hooks: {
      beforeCreate: (respuesta, options) => {
        respuesta.fecha = new Date();
      }
    }
  });
  trivia_respondida.associate = function (models) {
    //esto me agrega la columna usuario_id a la tabla, y el atributo usuario al model
    trivia_respondida.belongsTo(models.usuario, {as: 'usuario'});
    //esto me agrega la columna pregunta_id a la tabla, y el atributo pregunta al model
    trivia_respondida.belongsTo(models.trivia_pregunta, {as: 'pregunta'});
    //esto me agrega la columna respuesta_id a la tabla, y el atributo respuesta al model
    trivia_respondida.belongsTo(models.trivia_respuesta, {as: 'respuesta'});
  };
  return trivia_respondida;
};