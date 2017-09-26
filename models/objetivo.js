'use strict';

module.exports = function(sequelize, DataTypes) {
  var objetivo = sequelize.define('objetivo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
  	cant_meta : { type: DataTypes.INTEGER },
  	recompensa : { type: DataTypes.INTEGER } //es un numero que te da de puntos
  });
  objetivo.associate = function (models) {
    //esto me agrega la columna producto_id a la tabla, y el atributo producto al model
    objetivo.belongsTo(models.producto, {as: 'producto'});
    //esto me agrega la columna material_id a la tabla, y el atributo material al model
    objetivo.belongsTo(models.material, {as: 'material'});
    //esto me crea la tabla intermedia objetivo_usuario, y la lista de usuarios que lo cumplieron al model objetivo
    objetivo.belongsToMany(models.usuario, {as: 'usuarios_cumplidores', through: 'objetivo_usuario'});
    //esto me agrega la columna medalla_id a la tabla, y el atributo medalla al model
    objetivo.belongsTo(models.medalla, {as: 'medalla'});
  };
  return objetivo;
};