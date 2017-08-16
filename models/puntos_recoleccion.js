'use strict';

module.exports = function(sequelize, DataTypes) {
  var puntos_recoleccion = sequelize.define('puntos_recoleccion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
	direccion : { type: DataTypes.STRING},
	latitud : { type: DataTypes.FLOAT },
	longitud : { type: DataTypes.FLOAT },
	usuario_id : { type: DataTypes.INTEGER },
	fecha_baja : { type: DataTypes.DATE }
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