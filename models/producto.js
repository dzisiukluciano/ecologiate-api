'use strict';

module.exports = function(sequelize, DataTypes) {
  var producto = sequelize.define('producto', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre_producto: { type: DataTypes.STRING},
    cant_material: { type: DataTypes.INTEGER },
  	codigo_barra: { type: DataTypes.BIGINT, unique: true },
    //estado : { type: DataTypes.ENUM('PENDIENTE','APROBADO','PROHIBIDO'), defaultValue: 'PENDIENTE' }
    estado : { type: DataTypes.STRING, defaultValue: 'PENDIENTE' }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    indexes: [
      {
        name: 'idx_nombre_producto',
        fields: ['nombre_producto']
      },
      {
        name: 'idx_producto_codigo_barra',
        fields: ['codigo_barra']
      },
      {
        name: 'idx_producto_estado',
        fields: ['estado']
      },
      {
        name: 'idx_producto_fecha_baja',
        fields: ['fecha_baja']
      },
      {
        name: 'idx_producto_categ',
        fields: ['categoria_id']
      },
      {
        name: 'idx_producto_material',
        fields: ['material_id']
      },
      {
        name: 'idx_producto_usuario',
        fields: ['usuario_alta_id']
      }
    ]
  });

  producto.associate = function (models) {
    //esto me agrega la columna categoria_id a la tabla, y el atributo categoria al model
    producto.belongsTo(models.categoria, {as: 'categoria'});
    //esto me agrega la columna material_id a la tabla, y el atributo material al model
    producto.belongsTo(models.material, {as: 'material'});
    //esto me crea la columna producto_id en objetivo, y la lista de objetivos en el model producto
    producto.hasMany(models.objetivo, {as: 'objetivos', foreignKey: 'producto_id'});
    //esto me crea la columna producto_id en campania, y la lista de campanias en el model producto
    producto.hasMany(models.campania, {as: 'campanias', foreignKey: 'producto_id'});
    //esto me agrega la columna usuario_alta_id a la tabla, y el atributo usuario_alta al model
    producto.belongsTo(models.usuario, {as: 'usuario_alta'});
    //esto me crea la columna producto_id en reciclaje_usuario, y la lista de reciclajes en el model producto
    producto.hasMany(models.reciclaje_usuario, {as: 'reciclajes', foreignKey: 'producto_id'});
    //esto me crea la columna producto_id en tip, y la lista de tips en el model producto
    producto.hasMany(models.tip, {as: 'tips', foreignKey: 'producto_id'});
  };
  return producto;
};