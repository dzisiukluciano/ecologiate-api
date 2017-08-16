'use strict';

module.exports = function(sequelize, DataTypes) {
  var objetivo_usuario = sequelize.define('objetivo_usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true},
    objetivo_id: { type: DataTypes.INTEGER}, 
    usuario_id: { type: DataTypes.INTEGER},
	fecha_inicio: { type: DataTypes.DATE},
	cumplido :{ type: DataTypes.STRING}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //objetivo_usuario.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.objetivo_usuario);
      }
    },
    indexes: [
      {
        name: 'idx_objetivos_id_usuarios_id',
        fields: ['usuario_id']
      },
      {
        name: 'idx_usuarios_objetivos_id',
        fields: ['objetivo_id']
      }
    ]
  });
  return objetivo_usuario;
};