'use strict';

module.exports = function(sequelize, DataTypes) {
  var reciclaje_Usuario = sequelize.define('reciclaje_Usuario', {
    id: { type: DataTypes.bigint, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.int }, 
    producto_id: { type: DataTypes.int },
    punto_rec_id: { type: DataTypes.int},
    cant_prod: { type: DataTypes.int},
    fecha : { type: DataTypes.Date }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //reciclaje_Usuario.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.reciclaje_Usuario);
      }
    }
  });
  return reciclaje_Usuario;
};