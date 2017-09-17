var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

/* examples
	/api/pdr   	=> devuelve todos los pdr
				=> pasandole una lista de materiales devuelve todoslos puntos que tengan esos materiales
	/api/pdr (post) => pasandole descripcion, direccion, latitud, longitud, usuario y materiales inserta nuevo punto de recoleccion
	/api/pdr/review => pasandole usuario, punto_rec_id, puntuacion y comentario inserta nueva review
*/


router.get('/', function(req, res, next) {
	console.log('Búsqueda de puntos de recolección');
	//devuelvo todos los puntos
	models.puntos_recoleccion.findAll().then(function(data){
		res.send(data);
	});
	/*
	var materiales = req.query.materiales;
	if(materiales.length >0){
		//busco todos los puntos que esten asociados a los materiales recibidos
		models.material_puntos.findAll({attributes: punto_rec_id },{where: {material_id: {$in:materiales} }}).then(puntos_material => {
			//busco todos los datos de los puntos
			if(puntos_material.length > 0){
				models.puntos_recoleccion.findAll({where:{id: {$in: puntos_material}}}).then(puntos => {
					res.send(puntos);
				});
			}
		});
	}else{
		//devuelvo todos los puntos
		models.puntos_recoleccion.findAll().then(function(data){
			res.send(data);
		});
	}
	*/
	
});

//alta de punto rec
router.post('/', function(req, res, next) {
	var descripcion_param = req.body.descripcion;
  	var direccion_param = req.body.direccion;
  	var latitud_param = req.body.latitud;
  	var longitud_param  = req.body.longitud;
  	var usuario_param  = req.body.usuario;
  	var materiales_param  = req.body.materiales;

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
				}else{
					console.log('No hay materiales asociados al punto');
					res.send({status_code:404, mensaje:'No hay materiales asociados al punto'});
				}
			});
		}).then(function (result) {
            console.log('Transacción se completo exitosamente!');
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

//review del punto
router.post('/review', function(req, res, next) {
  	var usuario_param  = req.body.usuario;
  	var punto_rec_id_param = req.body.punto_rec_id;
  	var puntuacion_param = req.body.puntuacion;//boolean??
  	var comentario_param = req.body.comentario;

  	//busco usuario
  	models.usuario.findOne({ where: {id: usuario_param} }).then(user => {
    	if(user){
    		console.log('usuario encontrado!');
    		//busco punto
    		models.puntos_recoleccion.findOne({ where: {id: punto_rec_id_param} }).then(punto => {
    			if(punto){
    				console.log('punto de recoleccion encontrado!');
    				sequelize.transaction(function (t) {
    					models.opiniones_Puntos_Rec.create({
							usuario_id: usuario_param,
							punto_rec_id: punto_rec_id_param,
							puntuacion: puntuacion_param,
							comentario : comentario_param,
							fecha: new Date()
						});	
    				}).then(function (result) {
			            console.log('Transacción se completo exitosamente!');
			            //console.log(respuesta);
			            res.send({status_code:200, mensaje:'Opinion de punto de recoleccion insertada correctamente'});
			        }).catch(function (err) {
			            console.log('Error: ' + err);
			            res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
			        });
    			}
    		});
    	}
    });
});

module.exports = router;


