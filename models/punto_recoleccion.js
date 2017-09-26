'use strict';

module.exports = function(sequelize, DataTypes) {
  var punto_recoleccion = sequelize.define('punto_recoleccion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
  	direccion : { type: DataTypes.STRING},
  	latitud : { type: DataTypes.FLOAT, unique: 'unique_idx_pdr_latlng' },
  	longitud : { type: DataTypes.FLOAT, unique: 'unique_idx_pdr_latlng' },
    pais : { type: DataTypes.STRING},
    area : { type: DataTypes.STRING}
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    indexes: [
      {
        name: 'idx_punto_usuario_pais',
        fields: ['pais']
      },
      {
        name: 'idx_punto_usuario_area',
        fields: ['area']
      }
    ]
  });
  punto_recoleccion.associate = function (models) {
    //esto me crea la tabla intermedia material_punto, y la lista de materiales al model punto_recoleccion
    punto_recoleccion.belongsToMany(models.material, {as: 'materiales', through: 'material_punto'});
    //esto me crea la columna punto_rec_id en opinion_punto_rec, y la lista de opiniones en el model punto_recoleccion
    punto_recoleccion.hasMany(models.opinion_punto_rec, {as: 'opiniones', foreignKey: 'punto_rec_id'});
    //esto me agrega la columna usuario_alta_id a la tabla, y el atributo usuario_alta al model
    punto_recoleccion.belongsTo(models.usuario, {as: 'usuario_alta'});
    //esto me crea la columna punto_rec_id en reciclaje_usuario, y la lista de reciclajes en el model punto_recoleccion
    punto_recoleccion.hasMany(models.reciclaje_usuario, {as: 'reciclajes', foreignKey: 'punto_rec_id'});
  };
  return punto_recoleccion;
};