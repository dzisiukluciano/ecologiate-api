'use strict';

module.exports = function(sequelize, DataTypes) {
  var opiniones_Puntos_Rec = sequelize.define('opiniones_Puntos_Rec', {
    id: { type: DataTypes.int, primaryKey: true, autoIncrement: true},
    usuario_id: { type: DataTypes.int}, 
    punto_rec_id: { type: DataTypes.int},
	puntuacion: { type: DataTypes.int},
	comentario: { type: DataTypes.String},
    fecha : { type: DataTypes.Date}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //opiniones_Puntos_Rec.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.opiniones_Puntos_Rec);
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
  return opiniones_Puntos_Rec;
};