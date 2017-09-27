'use strict';

module.exports = function(sequelize, DataTypes) {
  var tip = sequelize.define('tip', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    titulo : { type: DataTypes.STRING},
    descripcion : { type: DataTypes.STRING},
  	imagen : { type: DataTypes.STRING }
  },
  {
    indexes: [
      {
        name: 'idx_tip_producto',
        fields: ['producto_id']
      },
      {
        name: 'idx_tip_material',
        fields: ['material_id']
      }
    ]
  });
  tip.associate = function (models) {
    //esto me agrega la columna producto_id a la tabla, y el atributo producto al model
    tip.belongsTo(models.producto, {as: 'producto'});
    //esto me agrega la columna material_id a la tabla, y el atributo material al model
    tip.belongsTo(models.material, {as: 'material'});
  };
  return tip;
};