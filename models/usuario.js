'use strict';

module.exports = function(sequelize, DataTypes) {
  var usuario = sequelize.define('usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    nombre: { type: DataTypes.STRING },
  	apellido: { type: DataTypes.STRING },
  	mail: { type: DataTypes.STRING },
    puntos: { type: DataTypes.BIGINT },
    admin: { type: DataTypes.BOOLEAN, defaultValue: false }
  }, 
  {
    timestamps: true, //me agrega el createdAt y updatedAt
    paranoid: true, //me agrega el deletedAt
    createdAt: 'fecha_alta',
    updatedAt: 'fecha_modificacion',
    deletedAt: 'fecha_baja',
    indexes: [
      {
        name: 'idx_usuario_mail',
        fields: ['mail']
      },
      {
        name: 'idx_usuario_fecha_baja',
        fields: ['fecha_baja']
      },
      {
        name: 'idx_usuario_nivel',
        fields: ['nivel_id']
      }
    ]
  });
  usuario.associate = function (models) {
    //esto me crea la tabla intermedia grupo_usuario, y la lista de grupos al model usuario
    usuario.belongsToMany(models.grupo, {as: 'grupos', through: 'grupo_usuario'});
    //esto me crea la tabla intermedia objetivo_usuario, y la lista de objetivos_cumplidos al model usuario
    usuario.belongsToMany(models.objetivo, {as: 'objetivos_cumplidos', through: 'objetivo_usuario'});
    //esto me crea la tabla intermedia campania_usuario, y la lista de campanias_cumplidas al model usuario
    usuario.belongsToMany(models.campania, {as: 'campanias_cumplidas', through: 'campania_usuario'});
    //esto me crea la columna usuario_id en reciclaje_usuario, y la lista de reciclajes en el model usuario
    usuario.hasMany(models.reciclaje_usuario, {as: 'reciclajes', foreignKey: 'usuario_id'});
    //esto me agrega la columna nivel_id a la tabla, y el atributo nivel al model
    usuario.belongsTo(models.nivel, {as: 'nivel'});
    //esto me crea la tabla intermedia usuario_medalla, y la lista de medallas al model usuario
    usuario.belongsToMany(models.medalla, {as: 'medallas', through: 'usuario_medalla'});
    //esto me crea la columna usuario_id en token, y la lista de tokens en el model usuario
    usuario.hasMany(models.token, {as: 'tokens', foreignKey: 'usuario_id'});
  };
  return usuario;
};