var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/:idParam', function(req, res, next) {
  var idParametro = req.params.idParam;
	models.producto.findOne({ where: {id: idParametro} }).then(producto => {  
	    if(producto){
			console.log("producto encontrado");
			models.materiales.findOne({ where: {id: producto.tipo_material} }).then(material => {
				if(material){
				  console.log('material encontrado!');
				  models.categoria.findOne({ where: {id: producto.categoria_id} }).then(categoria => { 
					 if(categoria){
						 console.log('categoria encontrada!');
						 res.send({producto:producto, material:material, categoria:categoria, status_code:200});
					 }else{
					  console.log("categoría no encontrada");
					  res.send({status_code:404, mensaje:'Categoría no encontrada'});
					}
				  });
				}else{
				  console.log("material no encontrado");
				  res.send({status_code:404, mensaje:'Material no encontrado'});
				}
			});
	    }else{
	      console.log("producto no encontrado");
	      res.send({status_code:404, mensaje:'Producto no encontrado'});
	    }
  });
});


module.exports = router;


