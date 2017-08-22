var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET items listing. */
router.get('/', function(req, res, next) {
  models.producto.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:codeParam', function(req, res, next) {
  var codeParametro = req.params.codeParam;
  models.producto.findOne({ where: {codigo_barra: codeParametro} }).then(producto => {  /*  el code es el de la entidad  */
    if(producto){
		console.log("producto encontrado");
	    producto.status_code = 200; //200 ok
	    //res.send(producto);
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


