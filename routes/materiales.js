var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/', function(req, res, next) {
  models.materiales.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:descripcion', function(req, res, next) {
  var descParam = req.params.descripcion;
  
//busco materiales
  models.materiales.findAll({ where: {descripcion:{$like: '%'+descParam+'%'} } }).then(materiales => {
    if(materiales){
    	console.log('materiales encontrados!');
    	materiales.statusCode = 200; //200 ok
    	res.send(materiales);
	}else{
        console.log('No se encontraron materiales!');
        res.send({status_code:404, mensaje:'No se encontraron materiales'});
    }
  });
});

module.exports = router;