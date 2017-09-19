'use strict';

module.exports = function(sequelize, DataTypes) {
  var respuestas = sequelize.define('respuestas', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	descripcion: { type: DataTypes.STRING}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //niveles.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.niveles);
      }
    }
  });
  return respuestas;
};