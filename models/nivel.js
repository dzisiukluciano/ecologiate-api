'use strict';

module.exports = function(sequelize, DataTypes) {
  var nivel = sequelize.define('nivel', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
    cant_medallas : { type: DataTypes.INTEGER }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return nivel;
};