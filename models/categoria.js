'use strict';

module.exports = function(sequelize, DataTypes) {
  var categoria = sequelize.define('categoria', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING }
  });
  categoria.associate = function (models) {
    //esto me agrega la columna categoria_id al producto, y el atributo productos al model categoria
    categoria.hasMany(models.producto, {as: 'productos', foreignKey: 'categoria_id'});
  };
  return categoria;
};