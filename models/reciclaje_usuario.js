'use strict';

module.exports = function(sequelize, DataTypes) {
  var reciclaje_usuario = sequelize.define('reciclaje_usuario', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    cant_prod: { type: DataTypes.INTEGER},
    fecha : { type: DataTypes.DATE }
  }, 
  {
    //TODO índice por fecha
    hooks: {
      beforeCreate: (reciclaje, options) => {
        reciclaje.fecha = new Date();
      }
    },
    indexes: [
      {
        name: 'idx_reciclaje_usuario',
        fields: ['usuario_id']
      },
      {
        name: 'idx_reciclaje_producto',
        fields: ['producto_id']
      },
      {
        name: 'idx_reciclaje_fecha',
        fields: ['fecha']
      },
      {
        name: 'idx_reciclaje_punto',
        fields: ['punto_rec_id']
      }
    ]
  });
  reciclaje_usuario.associate = function (models) {
    //esto me agrega la columna usuario_id a la tabla, y el atributo usuario al model
    reciclaje_usuario.belongsTo(models.usuario, {as: 'usuario'});
    //esto me agrega la columna producto_id a la tabla, y el atributo producto al model
    reciclaje_usuario.belongsTo(models.producto, {as: 'producto'});
    //esto me agrega la columna punto_rec_id a la tabla, y el atributo punto_rec al model
    reciclaje_usuario.belongsTo(models.punto_recoleccion, {as: 'punto_rec'});
  };
  return reciclaje_usuario;
};