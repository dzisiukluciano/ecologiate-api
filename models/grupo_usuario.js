'use strict';

module.exports = function(sequelize, DataTypes) {
  var grupo_usuario = sequelize.define('grupo_usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    grupo_id: { type: DataTypes.int}, 
    usuario_id: { type: DataTypes.int}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //grupo_usuario.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.grupo_usuario);
      }
    },
    indexes: [
      {
        name: 'idx_usuario_grupo_id',
        fields: ['grupo_id']
      },
      {
        name: 'idx_grupo_usuario_id',
        fields: ['usuario_id']
      }
    ]
  });
  return grupo_usuario;
};