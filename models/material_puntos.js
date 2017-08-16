'use strict';

module.exports = function(sequelize, DataTypes) {
  var material_puntos = sequelize.define('material_puntos', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    material_id: { type: DataTypes.INTEGER}, 
    punto_rec_id: { type: DataTypes.INTEGER}
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //material_puntos.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.material_puntos);
      }
    },
    indexes: [
      {
        name: 'idx_mat_puntos_material_id',
        fields: ['material_id']
      },
      {
        name: 'idx_mat_puntos_rec_id',
        fields: ['punto_rec_id']
      }
    ]
  });
  return material_puntos;
};