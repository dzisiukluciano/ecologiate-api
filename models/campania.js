'use strict';

module.exports = function(sequelize, DataTypes) {
  var campania = sequelize.define('campania', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
  	cant_producto : { type: DataTypes.INTEGER },
  	recompensa : { type: DataTypes.INTEGER },
  	fecha_inicio: { type: DataTypes.DATE },
  	fecha_fin: { type: DataTypes.DATE },
  	nivel: { type: DataTypes.INTEGER }
  },
  {
    indexes: [
      {
        name: 'idx_campania_fecha_inicio',
        fields: ['fecha_inicio']
      },
      {
        name: 'idx_campania_fecha_fin',
        fields: ['fecha_fin']
      },
      {
        name: 'idx_campania_nivel',
        fields: ['nivel']
      }
    ]
  });
  campania.associate = function (models) {
    //esto me agrega la columna producto_id a la tabla, y el atributo producto al model
    campania.belongsTo(models.producto, {as: 'producto'});
  };
  return campania;
};