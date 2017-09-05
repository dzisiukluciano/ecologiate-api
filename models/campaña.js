'use strict';

module.exports = function(sequelize, DataTypes) {
  var campaña = sequelize.define('campaña', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
	producto_id : { type: DataTypes.INTEGER},
	cant_producto : { type: DataTypes.INTEGER },
	campañas_recompensa : { type: DataTypes.INTEGER },
	fecha_inicio: { type: DataTypes.DATE },
	fecha_fin: { type: DataTypes.DATE },
	nivel: { type: DataTypes.INTEGER }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //campaña.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.campaña);
      }
    },
    indexes: [
      {
        name: 'idx_campaña_producto_id',
        fields: ['producto_id']
      }
    ]
  });
  return campaña;
};