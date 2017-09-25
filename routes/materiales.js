var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/', function(req, res, next) {
  models.material.findAll({
  	attributes: ['id','descripcion']
  })
  .then(function(data){
    res.send(data)
  });
});


module.exports = router;