'use strict';

module.exports = function(sequelize, DataTypes) {
  var categoria = sequelize.define('categoria', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING }
  });
  categoria.associate = function (models) {
    //esto me agrega la columna categoria_id al producto, y el atributo productos al model categoria
    categoria.hasMany(models.producto, {as: 'productos', foreignKey: 'categoria_id'});
    //esto me agrega la columna categoria_id al material, y el atributo materiales al model categoria
    categoria.hasMany(models.material, {as: 'materiales', foreignKey: 'categoria_id'});
    //esto me crea la tabla intermedia categoria_subcategoria, y la lista de usuarios a un model grupo
    categoria.belongsToMany(models.categoria, {as: 'subcategorias', through: 'categoria_subcategoria', 
      foreignKey: 'categoria_id'});
  };
  return categoria;
};