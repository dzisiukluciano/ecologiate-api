var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Deprecada');
});

//router.get('/:descripcion/:direccion/:latitud/:longitud/:usuario_id', function(req, res, next) {
router.post('/alta_punto_rec', function(req, res, next) {
  var descripcion_param = req.body.descripcion;
  var direccion_param = req.body.direccion;
  var latitud_param = req.body.latitud;
  var longitud_param  = req.body.longitud;
  var usuario_id_param  = req.body.usuario_id;
  var material_id_param  = req.body.material_id;
  
//busco usuario
  models.usuario.findOne({ where: {id: usuario_id_param} }).then(user => {
    if(user){
      console.log('usuario encontrado!');
      user.statusCode = 200; //200 ok
		//busco material
		models.materiales.findOne({ where: {id: material_id_param} }).then(material => {
			if(material){
				console.log('material encontrado!');
				//inserto PR
				models.puntos_recoleccion.create({
					descripcion: descripcion_param,
					direccion: direccion_param,
					latitud: latitud_param,
					longitud : longitud_param,
					usuario_id: usuario_id_param
				})
				models.material_puntos.create({
					material_id: material_id_param,
					punto_rec_id: res.insertId
				})
				console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' crea el punto de recoleccion ' + descripcion_param);
				res.send({status_code:200, mensaje:'Producto creado exitosamente'});
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