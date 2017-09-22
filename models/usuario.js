'use strict';

module.exports = function(sequelize, DataTypes) {
  var usuario = sequelize.define('usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    objetivo_id: { type: DataTypes.INTEGER },
    nombre: { type: DataTypes.STRING },
  	apellido: { type: DataTypes.STRING },
  	mail: { type: DataTypes.STRING },
    token: { type: DataTypes.STRING },
    origen_login: { type: DataTypes.STRING },
    nivel_usuario: { type: DataTypes.INTEGER },
    cant_medallas: { type: DataTypes.INTEGER },
    puntos: { type: DataTypes.BIGINT }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //usuario.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.usuario);
        //usuario.hasOne(objetivo);
      }
    },
    indexes: [
      {
        name: 'idx_usuario_objetivo_id',
        fields: ['objetivo_id']
      }
    ]
  });
  usuario.associate = function (models) {
    //esto me crea la tabla intermedia grupo_usuario, y la lista de grupos a un model usuario
    usuario.belongsToMany(models.grupo, {as: 'grupos', through: 'grupo_usuario'});
  };
  return usuario;
};