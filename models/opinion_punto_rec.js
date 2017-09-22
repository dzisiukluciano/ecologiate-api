'use strict';

module.exports = function(sequelize, DataTypes) {
  var opinion_punto_rec = sequelize.define('opinion_punto_rec', {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
    usuario_id: { type: DataTypes.INTEGER}, 
    punto_rec_id: { type: DataTypes.INTEGER},
  	puntuacion: { type: DataTypes.INTEGER},
  	comentario: { type: DataTypes.STRING},
    fecha_alta : { type: DataTypes.DATE },
    fecha_modificacion : { type: DataTypes.DATE },
    fecha_baja : { type: DataTypes.DATE }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
       
      }
    },
    indexes: [
      {
        name: 'idx_opinion_usuario_id',
        fields: ['usuario_id']
      },
      {
        name: 'idx_opinion_punto_rec_id',
        fields: ['punto_rec_id']
      }
    ]
  });
  return opinion_punto_rec;
};