'use strict';

module.exports = function(sequelize, DataTypes) {
  var punto_recoleccion = sequelize.define('punto_recoleccion', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    descripcion : { type: DataTypes.STRING},
  	direccion : { type: DataTypes.STRING},
  	latitud : { type: DataTypes.FLOAT },
  	longitud : { type: DataTypes.FLOAT },
  	usuario_id : { type: DataTypes.INTEGER },
    oficial : { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false },
    fecha_alta : { type: DataTypes.DATE },
    fecha_modificacion : { type: DataTypes.DATE },
    fecha_baja : { type: DataTypes.DATE }
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
        //puntos_recoleccion.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.puntos_recoleccion);
      }
    },
    indexes: [
      {
        name: 'idx_punto_usuario_id',
        fields: ['usuario_id']
      }
    ]
  });
  punto_recoleccion.associate = function (models) {
    //esto me crea la tabla intermedia material_punto, y la lista de materiales al model punto_recoleccion
    punto_recoleccion.belongsToMany(models.material, {as: 'materiales', through: 'material_punto'});
  };
  return punto_recoleccion;
};