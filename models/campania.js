'use strict';

module.exports = function(sequelize, DataTypes) {
  var campania = sequelize.define('campania', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    titulo : { type: DataTypes.STRING},
    descripcion : { type: DataTypes.STRING},
  	cant_meta : { type: DataTypes.INTEGER },
  	recompensa : { type: DataTypes.INTEGER }, //es un numero que te da de puntos
  	fecha_inicio: { type: DataTypes.DATE },
  	fecha_fin: { type: DataTypes.DATE }
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
      }
    ]
  });
  campania.associate = function (models) {
    //esto me agrega la columna producto_id a la tabla, y el atributo producto al model
    campania.belongsTo(models.producto, {as: 'producto'});
    //esto me agrega la columna material_id a la tabla, y el atributo material al model
    campania.belongsTo(models.material, {as: 'material'});
    //esto me agrega la columna medalla_id a la tabla, y el atributo medalla al model
    campania.belongsTo(models.medalla, {as: 'medalla'});
    //esto me crea la tabla intermedia campania_usuario, y la lista de usuarios que lo cumplieron al model campania
    campania.belongsToMany(models.usuario, {as: 'usuarios_cumplidores', through: 'campania_usuario'});
  };
  return campania;
};