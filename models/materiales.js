'use strict';

module.exports = function(sequelize, DataTypes) {
  var materiales = sequelize.define('materiales', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
	descripcion: { type: DataTypes.STRING},
	equ_arboles: { type: DataTypes.INTEGER}, 
    equ_energia: { type: DataTypes.INTEGER},
	equ_agua: { type: DataTypes.INTEGER},
    tipo_material_equ : { type: DataTypes.INTEGER},
	puntos: { type: DataTypes.INTEGER}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //materiales.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.materiales);
        materiales.hasMany(models.producto);
      }
    },
    indexes: [
      {
        name: 'idx_tipo_material_equ',
        fields: ['tipo_material_equ']
      }
    ]
  });
  return materiales;
};