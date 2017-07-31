'use strict';

module.exports = function(sequelize, DataTypes) {
  var Item = sequelize.define('Item', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    code: { type: DataTypes.STRING }, //indexado
    title: { type: DataTypes.STRING },
    manageable: { type: DataTypes.BOOLEAN, defaultValue: false},
    status: {type: DataTypes.ENUM('PENDING', 'APPROVED'), defaultValue: 'PENDING' }, //indexado
    description : { type: DataTypes.STRING },
    img_link: { type: DataTypes.STRING }
  }, 
  {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        //Item.belongsTo(models.User); por ejemplo
        //o sino User.hasMany(models.Item);
      }
    },
    indexes: [
      {
        unique: true,
        name: 'idx_itm_code',
        fields: ['code']
      },
      {
        name: 'idx_itm_status',
        fields: ['status']
      }
    ]
  });
  return Item;
};