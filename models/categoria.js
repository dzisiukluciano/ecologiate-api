'use strict';

module.exports = function(sequelize, DataTypes) {
  var categoria = sequelize.define('categoria', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //categoria.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.categoria);
        categoria.hasMany(producto);
      }
    }
  });
  return categoria;
};