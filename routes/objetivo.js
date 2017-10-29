var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/', function(req, res, next) {
  models.objetivo.findAll({
  	include:[
		{model: models.producto, as: 'producto'},
		{model: models.material, as: 'material'},
		{model: models.medalla, as: 'medalla'}
	] 
  })
  .then(function(data){
    res.send(data)
  });
});


module.exports = router;