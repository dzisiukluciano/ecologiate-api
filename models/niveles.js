'use strict';

module.exports = function(sequelize, DataTypes) {
  var niveles = sequelize.define('niveles', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    description : { type: DataTypes.STRING},
	cant_medallas : { type: DataTypes.int }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //niveles.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.niveles);
      }
    }
  });
  return niveles;
};