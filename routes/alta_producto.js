var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');
var sequelize = models.sequelize;

/* examples
	/api/alta_producto (post) => pasandole nombre, tipo_material, cant_material, categoria_id, usuario_id e imagen inserta nuevo producto
	
*/


router.post('/', function(req, res, next) {
  var nombre_param = req.body.nombre;
  var tipo_material_param = req.body.tipo_material;
  var cant_material_param = req.body.cant_material;
  var codigo_barra_param  = req.body.codigo_barra;
  var categoria_id_param  = req.body.categoria_id;
  var usuario_id_param  = req.body.usuario_id;
  
  //busco usuario
  models.usuario.findOne({ where: {id: usuario_id_param} }).then(usuario => {
    if(usuario){
      console.log('usuario encontrado!');
		//busco material
		models.material.findOne({ where: {id: tipo_material_param} }).then(material => {
		  if(material){
			console.log('material encontrado!');
			models.categoria.findOne({ where: {id: categoria_id_param} }).then(categoria => {
				if(categoria){
					console.log('categoria encontrada!');
					//inserto producto
					var producto = models.producto.create({
						nombre_producto: nombre_param,
						cant_material: cant_material_param,
						codigo_barra: codigo_barra_param,
						material_id: tipo_material_param,
						categoria_id : categoria_id_param,
						usuario_alta_id : usuario_id_param
					})
					.then(function (producto) {
        				console.log('El usuario ' + usuario.nombre + ' ' + usuario.apellido + ' creó el producto ' + nombre_param);
				 		res.send(producto);
			       	})
			       	.catch(function (err) {
			            console.log('Error: ' + err);
			            res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
			    	});
				}else{
					console.log('categoria no encontrada');
					res.send({status_code:404, mensaje:'Categoria no encontrado'});
				}
				});
		  }else{
			console.log('material no encontrado');
			res.send({status_code:404, mensaje:'Material no encontrado'});
		  }
		});
    }else{
      console.log('usuario no encontrado');
      res.send({status_code:404, mensaje:'Usuario no encontrado'});
    }
  });
});

module.exports = router;