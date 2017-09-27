'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respuesta = sequelize.define('trivia_respuesta', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    correcta: { type: DataTypes.BOOLEAN, defaultValue: false}
  },
  {
    indexes: [
      {
        name: 'idx_rta_pregunta',
        fields: ['pregunta_id']
      },
      {
        name: 'idx_rta_opcion',
        fields: ['opcion_id']
      }
    ]
  });
  trivia_respuesta.associate = function (models) {
    //esto me agrega la columna pregunta_id a la tabla, y el atributo pregunta al model
    trivia_respuesta.belongsTo(models.trivia_pregunta, {as: 'pregunta'});
    //esto me agrega la columna opcion_id a la tabla, y el atributo opcion al model
    trivia_respuesta.belongsTo(models.trivia_opcion, {as: 'opcion'});
  };
  return trivia_respuesta;
};