var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

/* examples
	/api/pdr     => devuelve todos los pdr
	/api/pdr?materiales=1,2,3   => devuelve los pdr para materiales con id 1, 2 y 3
*/
router.get('/', function(req, res, next) {
	console.log('Búsqueda de puntos de recolección');
	var materiales = req.query.materiales;
	if(materiales){
		console.log('materiales = '+materiales);
		//TO DO: búsqueda filtrada por materiales
	}
	models.puntos_recoleccion.findAll().then(function(data){
		res.send(data)
	});
});

//alta de punto rec
router.post('/', function(req, res, next) {
	var descripcion_param = req.body.descripcion;
  	var direccion_param = req.body.direccion;
  	var latitud_param = req.body.latitud;
  	var longitud_param  = req.body.longitud;
  	var usuario_param  = req.body.usuario;
  	var materiales_param  = req.body.materiales;
	
	/*var materiales = req.body.materiales;
	var user = req.body.user;
	var latitud= req.body.latitud;
	var longitud = req.body.longitud;*/

	//console.log(req.body);

	/*if(materiales != undefined && materiales.length > 0){
		for(var i = 0; i < materiales.length; i++){
			console.log("material: " + materiales[i]);
		}
	}
	res.send("tamo activo");*/

//busco usuario
  models.usuario.findOne({ where: {id: usuario_param} }).then(user => {
    if(user){
     	console.log('usuario encontrado!');
     	//user.statusCode = 200; //200 ok
		//inserto punto de rec
		sequelize.transaction(function (t) {
			models.puntos_recoleccion.create({
				descripcion: descripcion_param,
				direccion: direccion_param,
				latitud: latitud_param,
				longitud : longitud_param,
				usuario_id: usuario_param,
				fecha_baja: null
			}).then(function(ultimo_punto){
				//inserto materiales por punto
				console.log(ultimo_punto.id);
				if(materiales_param != undefined && materiales_param.length > 0){
					for(var i = 0; i < materiales_param.length; i++){
						models.materiales.findOne({ where: {id: materiales_param[i]} }).then(material => {
				  			if(material){
								console.log('material '+material.id+' encontrado!');
								models.material_puntos.create({
									material_id: material.id,
									punto_rec_id: ultimo_punto.id
								})
							}else{
								console.log('material '+materiales_param[i]+' no encontrado');
								res.send({status_code:404, mensaje:'No se encontro alguno de los materiales'});
							}
						});
					}
					//res.send({status_code:200, mensaje:'Punto de recoleccion insertado correctamente'});
				}else{
					console.log('No hay materiales asociados al punto');
					res.send({status_code:404, mensaje:'No hay materiales asociados al punto'});
				}
			});
		}).then(function (result) {
            console.log('Transacción se completo exitosamente!');
            //console.log(respuesta);
            res.send({status_code:200, mensaje:'Punto de recoleccion insertado correctamente'});
          }).catch(function (err) {
            console.log('Error: ' + err);
            res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
          });
	}else{
		console.log('Usuario no encontrado');
		res.send({status_code:404, mensaje:'Usuario no encontrado'});
	}		
  });
});

module.exports = router;


