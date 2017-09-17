var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/:nombreParam', function(req, res, next) {
  var nombreParametro = req.params.nombreParam;
  if(nombreParametro)
  	nombreParametro = nombreParametro.toLowerCase(); //lo paso a minúscula
  
  models.producto.findAll({ 
  		where: 
  		sequelize.where(sequelize.fn('LOWER',sequelize.col('nombre_producto')),{$like:'%'+nombreParametro+'%'}) 
  	})
  	.then(producto => { 
	    if(producto){
			console.log("productos encontrados");
			res.send({producto, status_code:200});
	    }else{
	      console.log("producto no encontrado");
	      res.send({status_code:404, mensaje:'Producto no encontrado'});
	    }
  });
});


module.exports = router;


