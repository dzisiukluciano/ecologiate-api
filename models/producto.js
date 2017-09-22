'use strict';

module.exports = function(sequelize, DataTypes) {
  var producto = sequelize.define('producto', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre_producto: { type: DataTypes.STRING},
    cant_material: { type: DataTypes.INTEGER },
  	fecha_alta : { type: DataTypes.DATE},
  	fecha_baja : { type: DataTypes.DATE},
  	codigo_barra: { type: DataTypes.BIGINT },
  	usuario_id : { type: DataTypes.INTEGER},
  	imagen : { type: DataTypes.STRING },
    estado : { type: DataTypes.STRING }
  }, 
  {
    indexes: [
      {
        name: 'idx_nombre_producto',
        fields: ['nombre_producto']
      },
      {
        name: 'idx_producto_codigo_barra',
        fields: ['codigo_barra']
      }
    ]
  });

  producto.associate = function (models) {
    //esto me agrega la columna categoria_id a la tabla, y el atributo categoria al model
    producto.belongsTo(models.categoria, {as: 'categoria', foreignKey: 'categoria_id'});
    //esto me agrega la columna material_id a la tabla, y el atributo material al model
    producto.belongsTo(models.material, {as: 'material', foreignKey: 'material_id'});
  };
  return producto;
};