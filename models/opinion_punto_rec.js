'use strict';

module.exports = function(sequelize, DataTypes) {
  var opinion_punto_rec = sequelize.define('opinion_punto_rec', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
  	puntuacion: { type: DataTypes.BOOLEAN},
  	comentario: { type: DataTypes.STRING},
    usuario_id: {type: DataTypes.BIGINT, unique: 'unique_idx_usuario_punto'},
    punto_rec_id: {type: DataTypes.BIGINT, unique: 'unique_idx_usuario_punto'}
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja'
  });
  opinion_punto_rec.associate = function (models) {
    //esto me agrega la columna usuario_id a la tabla, y el atributo usuario al model
    opinion_punto_rec.belongsTo(models.usuario, {as: 'usuario'});
    //esto me agrega la columna punto_rec_id a la tabla, y el atributo punto_rec al model
    opinion_punto_rec.belongsTo(models.punto_recoleccion, {as: 'punto_rec'});
  };
  return opinion_punto_rec;
};