'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_pregunta = sequelize.define('trivia_pregunta', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING },
  	explicacion : { type: DataTypes.STRING },
  	imagen : { type: DataTypes.STRING }
  },
  {
    indexes: [
      {
        name: 'idx_pregunta_respuesta',
        fields: ['respuesta_correcta_id']
      }
    ]
  });
  trivia_pregunta.associate = function (models) {
    //esto me crea la columna pregunta_id en trivia_respondida, y la lista de respuestas_usuarios en este model
    trivia_pregunta.hasMany(models.trivia_respondida, {as: 'respuestas_usuarios', foreignKey: 'pregunta_id'});
    //esto me agrega la columna respuesta_correcta_id a la tabla, y el atributo respuesta_correcta al model
    trivia_pregunta.belongsTo(models.trivia_respuesta, {as: 'respuesta_correcta'});
  };
  return trivia_pregunta;
};