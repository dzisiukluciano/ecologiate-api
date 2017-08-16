'use strict';

module.exports = function(sequelize, DataTypes) {
  var evento = sequelize.define('evento', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
	producto_id : { type: DataTypes.INTEGER},
	cant_producto : { type: DataTypes.INTEGER },
	medallas_recompensa : { type: DataTypes.INTEGER }
	fecha_inicio: { type: DataTypes.DATE },
	fecha_fin: { type: DataTypes.DATE },
	nivel: { type: DataTypes.INTEGER }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //evento.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.evento);
      }
    },
    indexes: [
      {
        name: 'idx_evento_producto_id',
        fields: ['producto_id']
      }
    ]
  });
  return evento;
};