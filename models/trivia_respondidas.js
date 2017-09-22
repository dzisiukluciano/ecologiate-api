'use strict';

module.exports = function(sequelize, DataTypes) {
  var trivia_respondidas = sequelize.define('trivia_respondidas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    id_sesion: { type: DataTypes.INTEGER },
    id_pregunta: { type: DataTypes.INTEGER },
    usuario_id : { type: DataTypes.INTEGER },
    correcta: { type: DataTypes.BOOLEAN},
    fecha: { type: DataTypes.DATE }
  }, 
  {
    hooks: {
      beforeCreate: (respuesta, options) => {
        respuesta.fecha = new Date();
      }
    },
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //trivia_respondidas.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.trivia_respondidas);
      }
    }
  });
  return trivia_respondidas;
};