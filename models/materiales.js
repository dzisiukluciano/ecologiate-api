'use strict';

module.exports = function(sequelize, DataTypes) {
  var materiales = sequelize.define('materiales', {
    id: { type: DataTypes.int, primaryKey: true, autoIncrement: true},
	descripcion: { type: DataTypes.String},
	equ_arboles: { type: DataTypes.int}, 
    equ_energia: { type: DataTypes.int},
	equ_agua: { type: DataTypes.int},
    tipo_material_equ : { type: DataTypes.int}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //materiales.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.materiales);
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