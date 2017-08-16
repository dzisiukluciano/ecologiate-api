'use strict';

module.exports = function(sequelize, DataTypes) {
  var reciclaje_Usuario = sequelize.define('reciclaje_Usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    usuario_id: { type: DataTypes.INTEGER }, 
    producto_id: { type: DataTypes.INTEGER },
    punto_rec_id: { type: DataTypes.INTEGER},
    cant_prod: { type: DataTypes.INTEGER},
    fecha : { type: DataTypes.DATE }
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