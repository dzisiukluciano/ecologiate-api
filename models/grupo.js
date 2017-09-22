'use strict';

module.exports = function(sequelize, DataTypes) {
  var grupo = sequelize.define('grupo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre : { type: DataTypes.STRING },
    fecha_alta : { type: DataTypes.DATE },
    fecha_modificacion : { type: DataTypes.DATE },
    fecha_baja : { type: DataTypes.DATE }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja'
  });
  grupo.associate = function (models) {
    //esto me crea la tabla intermedia grupo_usuario, y la lista de usuarios a un model grupo
    grupo.belongsToMany(models.usuario, {as: 'usuarios', through: 'grupo_usuario'});
  };
  return grupo;
};