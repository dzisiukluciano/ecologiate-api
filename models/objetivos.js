'use strict';

module.exports = function(sequelize, DataTypes) {
  var objetivo = sequelize.define('objetivo', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    description : { type: DataTypes.STRING},
	producto_id : { type: DataTypes.int},
	cant_producto : { type: DataTypes.int },
	cant_medallas : { type: DataTypes.int }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //objetivo.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.objetivo);
      }
    },
    indexes: [
      {
        name: 'idx_objetivo_producto_id',
        fields: ['producto_id']
      }
    ]
  });
  return objetivo;
};