'use strict';

module.exports = function(sequelize, DataTypes) {
  var token = sequelize.define('token', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    valor: { type: DataTypes.STRING },
    tipo: { type: DataTypes.STRING },
  	activo: { type: DataTypes.BOOLEAN, defaultValue: true }
  }, 
  {
    indexes: [
      {
        name: 'idx_token_usuario',
        fields: ['usuario_id']
      }
    ]
  });
  token.associate = function (models) {
    //esto me agrega la columna usuario_id a la tabla, y el atributo usuario al model
    token.belongsTo(models.usuario, {as: 'usuario'});
  };
  return token;
};