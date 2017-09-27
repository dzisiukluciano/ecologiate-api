'use strict';

module.exports = function(sequelize, DataTypes) {
  var nivel = sequelize.define('nivel', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
    imagen_avatar : { type: DataTypes.STRING},
    puntos_desde : { type: DataTypes.INTEGER },
    puntos_hasta : { type: DataTypes.INTEGER }
  },
  {
    indexes: [
      {
        name: 'idx_nivel_puntos_desde',
        fields: ['puntos_desde']
      },
      {
        name: 'idx_nivel_puntos_hasta',
        fields: ['puntos_hasta']
      }
    ]
  });
  nivel.associate = function (models) {
    //esto me crea la columna nivel_id en usuario, y la lista de usuarios en el model nivel
    nivel.hasMany(models.usuario, {as: 'usuarios', foreignKey: 'nivel_id'});
    //esto me crea la columna nivel_id en objetivo, y la lista de objetivos en el model nivel
    //nivel.hasMany(models.objetivo, {as: 'objetivos', foreignKey: 'nivel_id'}); //ya no depende del nivel
  };
  return nivel;
};