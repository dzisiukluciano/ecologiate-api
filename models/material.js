'use strict';

module.exports = function(sequelize, DataTypes) {
  var material = sequelize.define('material', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
  	descripcion: { type: DataTypes.STRING},
    equ_arboles: { type: DataTypes.FLOAT}, 
    equ_energia: { type: DataTypes.FLOAT},
    equ_agua: { type: DataTypes.FLOAT},
    equ_emisiones : { type: DataTypes.FLOAT},
    puntos_otorgados: { type: DataTypes.INTEGER}
  },{
    indexes: [
      {
        name: 'idx_material_categ',
        fields: ['categoria_id']
      }
    ]
  });
  material.associate = function (models) {
    //esto me crea la columna material_id en producto, y la lista de productos en el model material
    material.hasMany(models.producto, {as: 'productos', foreignKey: 'material_id'});
    //esto me crea la tabla intermedia material_punto, y la lista de puntos_recoleccion al model material
    material.belongsToMany(models.punto_recoleccion, {as: 'puntos_recoleccion', through: 'material_punto'});
    //esto me agrega la columna categoria_id a la tabla, y el atributo categoria al model
    material.belongsTo(models.categoria, {as: 'categoria'});
    //esto me crea la columna material_id en objetivo, y la lista de objetivos en el model material
    material.hasMany(models.objetivo, {as: 'objetivos', foreignKey: 'material_id'});
    //esto me crea la columna material_id en campania, y la lista de campanias en el model material
    material.hasMany(models.campania, {as: 'campanias', foreignKey: 'material_id'});
    //esto me crea la columna material_id en tip, y la lista de tips en el model material
    material.hasMany(models.tip, {as: 'tips', foreignKey: 'material_id'});
  };
  return material;
};