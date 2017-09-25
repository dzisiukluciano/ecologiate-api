var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

/* GET items listing. */
router.get('/', function(req, res, next) {
	//TODO que no quede productiva esta api
  models.producto.findAll().then(function(data){
    res.send(data)
  });
});

//búsqueda por ID
router.get('/:idParam', function(req, res, next) {
  var idParametro = req.params.idParam;
	models.producto.findOne({ 
		where: {id: idParametro}, 
		//campos específicos
		attributes: ['id','nombre_producto','cant_material','codigo_barra','estado'],
		//asociaciones de las fk
		include:[
			{model: models.material, as: 'material'},
			{model: models.categoria, as: 'categoria'},
			{model: models.usuario, as: 'usuario_alta'}
		] 
	})
	.then(producto => {  
	    if(producto){
	    	console.log("producto encontrado");
	    	//ya tiene el material, categoría y usuario
	    	res.send({producto:producto, status_code:200});
	    }else{
	      console.log("producto no encontrado");
	      res.send({status_code:404, mensaje:'Producto no encontrado'});
	    }
  	});
});


//búsqueda por código
router.get('/codigo/:codeParam', function(req, res, next) {
	var codeParametro = req.params.codeParam;
	models.producto.findOne({ 
		where: {codigo_barra: codeParametro},
		//campos específicos
		attributes: ['id','nombre_producto','cant_material','codigo_barra','estado'],
		//asociaciones de las fk
		include:[
			{model: models.material, as: 'material'},
			{model: models.categoria, as: 'categoria'},
			{model: models.usuario, as: 'usuario_alta'}
		]
	})
	.then(producto => {  
		if(producto){
			console.log("producto encontrado");
			//ya tiene el material, categoría y usuario
			res.send({producto:producto, status_code:200});
		}else{
		  console.log("producto no encontrado");
		  res.send({status_code:404, mensaje:'Producto no encontrado'});
		}
	});
});


//búsqueda por nombre
router.get('/nombre/:nombreParam', function(req, res, next) {
  var nombreParametro = req.params.nombreParam;
  if(nombreParametro)
  	nombreParametro = nombreParametro.toLowerCase(); //lo paso a minúscula
  
  models.producto.findAll({ 
  		where: sequelize.where(sequelize.fn('LOWER',sequelize.col('nombre_producto')),{$like:'%'+nombreParametro+'%'}),
  		//campos específicos
		attributes: ['id','nombre_producto','estado']
  	})
  	.then(productos => { 
	    if(productos!=undefined && productos!=null && productos.length>0){
			console.log("productos encontrados");
			res.send({productos: productos, status_code:200});
	    }else{
	      console.log("producto no encontrado");
	      res.send({status_code:404, mensaje:'Producto no encontrado'});
	    }
  });
});


module.exports = router;


