'use strict';

module.exports = function(sequelize, DataTypes) {
  var material = sequelize.define('material', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  	descripcion: { type: DataTypes.STRING},
  	equ_arboles: { type: DataTypes.INTEGER}, 
    equ_energia: { type: DataTypes.INTEGER},
    equ_agua: { type: DataTypes.INTEGER},
    tipo_material_equ : { type: DataTypes.INTEGER},
    puntos_otorgados: { type: DataTypes.INTEGER}
  });
  material.associate = function (models) {
    //esto me crea la columna material_id en producto, y la lista de productos en el model material
    material.hasMany(models.producto, {as: 'productos', foreignKey: 'material_id'});
    //esto me crea la tabla intermedia material_punto, y la lista de puntos_recoleccion al model material
    material.belongsToMany(models.punto_recoleccion, {as: 'puntos_recoleccion', through: 'material_punto'});
  };
  return material;
};