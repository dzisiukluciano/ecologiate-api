var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

/* examples
	/api/pdr   	=> devuelve todos los pdr
	/api/pdr?materiales=1,5,7	=> devuelve todos los puntos que tengan esos materiales
	/api/pdr (post) => pasandole descripcion, direccion, latitud, longitud, usuario y materiales inserta nuevo punto de recoleccion
	/api/pdr/review => pasandole usuario, punto_rec_id, puntuacion y comentario inserta nueva review
*/


router.get('/', function(req, res, next) {
	console.log('Búsqueda de puntos de recolección');
	var materiales = [];
	materiales = req.query.materiales;
	console.log(materiales);
	/*var array2 = [];
	for(var i = 0; i < materiales.length; i++){
		array2.push(materiales[i]);
	};*/
	if(materiales != undefined && materiales.length >0){
		//busco todos los puntos que esten asociados a los materiales recibidos
		console.log('busco puntos segun materiales');
		//separo los valores obtenidos en un array
		var mat = materiales.split(",");
		//models.material_puntos.findAll({attributes: ['punto_rec_id'] },{where: {material_id: {$in:materiales} }}, { raw: true }).then(puntos_material => {
			models.material_puntos.findAll({where: {material_id: {$in:mat} }}).then(puntos_material => {
			//busco todos los datos de los puntos
			console.log('obtuve resultados');
			if(puntos_material != undefined && puntos_material.length > 0){
				console.log('encontro puntos');

				var array = [];
				puntos_material.forEach((puntoMaterialItem) => {
				    //console.log(puntoMaterialItem.get({
				    //    plain: true
				    //}));
				    array.push(puntoMaterialItem.punto_rec_id);
				    /*array.push(puntoMaterialItem.get({
				        plain: true
				    }));*/
				});
				console.log(array);
				//console.log(puntos_material.get({ plain: true}));
				models.puntos_recoleccion.findAll({where:{id: {$in: array}}}).then(puntos => {
					res.send(puntos);
				});
			}else{
				res.send({status_code:404, mensaje:'No hay puntos para los materiales indicados'});
			}
		});
	}else{
		//devuelvo todos los puntos
		models.puntos_recoleccion.findAll().then(function(data){
			res.send(data);
		});
	}
	
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
								console.log('material '+material.id+' no encontrado');
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
    				if(punto.usuario_id != user.id){
	    				//valido si el usuario ya hizo una review del punto
	    				models.opiniones_Puntos_Rec.findOne({where: {usuario_id: user.id, punto_rec_id: punto.id}}).then(review => {
	    					if(review){
	    						console.log('El usuario '+user.id+' ya realizó una review para el punto '+punto.id);
	    						res.send({status_code:404, mensaje:'Usuario ya hizo una review del punto'});
	    					} else {
	    						//no existe review
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
						            res.send({status_code:200, mensaje:'Opinion de punto de recoleccion insertada correctamente'});
						        }).catch(function (err) {
						            console.log('Error: ' + err);
						            res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
						        });
	    					}
	    				});
    				}else{
    					console.log('Usuario es el creador del punto, no puede hacer review');
    					res.send({status_code:404, mensaje:'Usuario es el creador del punto'});
    				}
    			}else{
    				console.log('El punto '+ punto.id + ' no fue encontrado');
    				res.send({status_code:404, mensaje:'El punto no fue encontrado'});
    			}
    		});
    	}else{
    		console.log('El usuario '+ user.id +' no fue encontrado');
	    	res.send({status_code:404, mensaje:'El usuario no fue encontrado'});
	    }
    });
});

module.exports = router;

