var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/', function(req, res, next) {
  models.categoria.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:descripcion', function(req, res, next) {
  var descParam = req.params.descripcion;
  
//busco categoria
  models.categoria.findAll({ where: {desc:{$like: '%'+descParam+'%'} } }).then(categorias => {
    if(categorias){
    	console.log('categorias encontradas!');
    	categorias.statusCode = 200; //200 ok
    	res.send(categorias);
	}else{
        console.log('No se encontraron categorias!');
        res.send({status_code:404, mensaje:'No se encontraron categorias'});
    }
  });
});

module.exports = router;