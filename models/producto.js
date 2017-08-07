'use strict';

module.exports = function(sequelize, DataTypes) {
  var producto = sequelize.define('producto', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre_producto: { type: DataTypes.STRING},
    tipo_material: { type: DataTypes.int },
    cant_material: { type: DataTypes.int },
	fecha_alta : { type: DataTypes.datetime},
	fecha_baja : { type: DataTypes.datetime},
	codigo_barra: { type: DataTypes.bigint },
	categoria_id : { type: DataTypes.int},
	usuario_id : { type: DataTypes.int}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //producto.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.producto);
      }
    },
    indexes: [
      {
        name: 'idx_nombre_producto',
        fields: ['nombre_producto']
      },
      {
        name: 'idx_producto_categoria_id',
        fields: ['categoria_id']
      }
    ]
  });
  return producto;
};