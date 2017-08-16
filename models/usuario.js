'use strict';

module.exports = function(sequelize, DataTypes) {
  var usuario = sequelize.define('usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    objetivo_id: { type: DataTypes.INTEGER }, //indexado
    nombre: { type: DataTypes.STRING },
	apellido: { type: DataTypes.STRING },
	mail: { type: DataTypes.STRING },
    nivel_usuario: { type: DataTypes.INTEGER },
    cant_medallas: { type: DataTypes.INTEGER },
	fecha_alta: { type: DataTypes.DATE },
	fecha_baja: { type: DataTypes.DATE }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //usuario.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.usuario);
      }
    },
    indexes: [
      {
        name: 'idx_usuario_objetivo_id',
        fields: ['objetivo_id']
      }
    ]
  });
  return usuario;
};