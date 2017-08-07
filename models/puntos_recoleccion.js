'use strict';

module.exports = function(sequelize, DataTypes) {
  var puntos_recoleccion = sequelize.define('puntos_recoleccion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    description : { type: DataTypes.STRING},
	direccion : { type: DataTypes.STRING},
	latitud : { type: DataTypes.float },
	longitud : { type: DataTypes.float },
	usuario_id : { type: DataTypes.int },
	estado : { type: DataTypes.STRING }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //puntos_recoleccion.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.puntos_recoleccion);
      }
    },
    indexes: [
      {
        name: 'idx_punto_usuario_id',
        fields: ['usuario_id']
      }
    ]
  });
  return puntos_recoleccion;
};