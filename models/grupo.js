'use strict';

module.exports = function(sequelize, DataTypes) {
  var grupo = sequelize.define('grupo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre : { type: DataTypes.STRING, allowNull: false, unique: true }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    indexes: [
      {
        name: 'idx_grupo_fecha_baja',
        fields: ['fecha_baja']
      }
    ]
  });
  grupo.associate = function (models) {
    //esto me crea la tabla intermedia grupo_usuario, y la lista de usuarios a un model grupo
    grupo.belongsToMany(models.usuario, {as: 'usuarios', through: 'grupo_usuario'});
  };
  return grupo;
};