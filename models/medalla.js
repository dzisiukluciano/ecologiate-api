'use strict';

module.exports = function(sequelize, DataTypes) {
  var medalla = sequelize.define('medalla', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre : { type: DataTypes.STRING },
    imagen : { type: DataTypes.STRING }
  });
  medalla.associate = function (models) {
    //esto me agrega el atributo objetivo al model medalla
    medalla.hasOne(models.objetivo, {as: 'objetivo', foreignKey: 'medalla_id'});
    //esto me agrega el atributo campania al model medalla
    medalla.hasOne(models.campania, {as: 'campania', foreignKey: 'medalla_id'});
    //esto me crea la tabla intermedia categoria_subcategoria, y la lista de usuarios a un model grupo
    medalla.belongsToMany(models.usuario, {as: 'usuarios', through: 'usuario_medalla'});
  };
  return medalla;
};