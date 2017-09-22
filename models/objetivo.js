'use strict';

module.exports = function(sequelize, DataTypes) {
  var objetivo = sequelize.define('objetivo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
  	producto_id : { type: DataTypes.INTEGER},
  	cant_producto : { type: DataTypes.INTEGER },
  	medallas_recompensa : { type: DataTypes.INTEGER },
  	fecha_alta: { type: DataTypes.DATE },
  	fecha_baja: { type: DataTypes.DATE },
  	nivel: { type: DataTypes.INTEGER }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        
      }
    },
    indexes: [
      {
        name: 'idx_objetivo_producto_id',
        fields: ['producto_id']
      }
    ]
  });
  return objetivo;
};