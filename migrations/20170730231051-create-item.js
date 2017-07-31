'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Items', {
        id: { type: Sequelize.BIGINT, primaryKey: true, autoIncrement: true },
        code: { type: Sequelize.STRING }, //indexar
        title: { type: Sequelize.STRING },
        manageable: { type: Sequelize.BOOLEAN, defaultValue: false},
        status: {type: Sequelize.ENUM('PENDING', 'APPROVED'), defaultValue: 'PENDING' }, //indexar
        description : { type: Sequelize.STRING },
        img_link: { type: Sequelize.STRING }
      }).then(function(){
        return queryInterface.addIndex('Items',['code'], {
          indexName: 'idx_itm_code',
          indicesType: 'UNIQUE'
        });
      }).then(function(){
        return queryInterface.addIndex('Items',['status'], {
          indexName: 'idx_itm_status'
        });
      }); 
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Items');
  }
};