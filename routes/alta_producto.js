var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Deprecada');
});

router.get('/:nombre/:tipo_material/:cant_material/:codigo_barra/:categoria_id/:usuario_id/:imagen', function(req, res, next) {
  var nombre_param = req.params.nombre;
  var tipo_material_param = req.params.tipo_material;
  var cant_material_param = req.params.cant_material;
  var codigo_barra_param  = req.params.codigo_barra;
  var categoria_id_param  = req.params.categoria_id;
  var usuario_id_param  = req.params.usuario_id;
  var imagen_param = req.params.imagen;
  
//busco usuario
  models.usuario.findOne({ where: {id: usuario_id_param} }).then(user => {
    if(user){
      console.log('usuario encontrado!');
      user.statusCode = 200; //200 ok
		//busco material
		models.materiales.findOne({ where: {id: tipo_material_param} }).then(material => {
		  if(material){
			console.log('material encontrado!');
			models.categoria.findOne({ where: {id: categoria_id_param} }).then(categoria => {
				if(categoria){
					console.log('categoria encontrada!');
					console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' crea el producto ' + nombre_param);
					//inserto producto
					models.producto.create({
						nombre_producto: nombre_param,
						tipo_material: tipo_material_param,
						cant_material: cant_material_param,
						fecha_alta : new Date(),
						//fecha_baja : 'NULL',
						codigo_barra: codigo_barra_param,
						categoria_id : categoria_id_param,
						usuario_id : usuario_id_param,
						imagen : imagen_param
					})
					 console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' crea el producto ' + nombre_param);
					 res.send({status_code:200, mensaje:'Producto creado exitosamente'});
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