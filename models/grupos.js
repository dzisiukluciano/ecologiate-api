'use strict';

module.exports = function(sequelize, DataTypes) {
  var grupo = sequelize.define('grupo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre : { type: DataTypes.STRING },
    fecha_alta : { type: DataTypes.datetime},
    usuario_id : { type: DataTypes.int }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //grupo.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.grupo);
      }
    },
    indexes: [
      {
        name: 'idx_grupo_usuario_id',
        fields: ['usuario_id']
      }
    ]
  });
  return grupo;
};