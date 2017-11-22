var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

/* examples
	/api/pdr   	=> devuelve todos los pdr
	/api/pdr?materiales=1,5,7	=> devuelve todos los puntos que tengan esos materiales
	/api/pdr?materiales=1,5,7&area=Buenos%20Aires&pais=Argentina	=> devuelve todos los puntos que tengan esos materiales, pais y area
	/api/pdr (post) => pasandole descripcion, direccion, latitud, longitud, usuario y materiales inserta nuevo punto de recoleccion
	/api/pdr/review => pasandole usuario, punto_rec_id, puntuacion y comentario inserta nueva review
*/


router.get('/', function(req, res, next) {
	console.log('Búsqueda de puntos de recolección');
	var materialesParam = req.query.materiales;
	var area = req.query.area;
	var pais = req.query.pais;
	console.log(materialesParam);

	var wherePdr = {}; //mapa con la condición where sobre atributos del pdr
	var whereMaterial = {}; //where sobre el join

	if(area != undefined && area!=null && area.length >0){
		wherePdr.area = area;
	}
	if(pais != undefined && pais!=null && pais.length >0){
		wherePdr.pais = pais;
	}

	if(materialesParam != undefined && materialesParam!=null && materialesParam.length >0){
		var materiales = materialesParam.split(",");
		whereMaterial = { id: { $in : materiales } }
	}

	models.punto_recoleccion.findAll({
		//condiciones sobre el pdr
		where : wherePdr,
		attributes: ['id','descripcion','direccion','latitud','longitud'],
		//asociaciones con condiciones que puse arriba
		include: [
			{model: models.material, as: 'materiales', where: whereMaterial, attributes:['id','descripcion']},
			{model: models.usuario, as: 'usuario_alta', attributes:['id','nombre','apellido']}
		]
	})
	.then(puntos => {
		if(puntos && puntos.length>0){
			res.setHeader('Content-Type', 'application/json');
			res.send({puntos: puntos, status_code:200});
		}else{
			console.log("pdrs no encontrados");
	      	res.send({status_code:404, mensaje:'No hay resultados'});
		}
	});
});

//alta de punto rec
router.post('/', function(req, res, next) {
	var descripcion_param = req.body.descripcion;
  	var direccion_param = req.body.direccion;
  	var latitud_param = req.body.latitud;
  	var longitud_param  = req.body.longitud;
  	var area_param = req.body.area;
  	var pais_param = req.body.pais;
  	var usuario_param  = req.body.usuario;
  	var materiales_param  = req.body.materiales; //un array


	//busco usuario
 	models.usuario.findOne({ where: {id: usuario_param} }).then(user => {
	    if(user){
	     	console.log('usuario encontrado!');
	     	models.material.findAll({where: { id: { $in : materiales_param } }}).then(materiales => {
	     		if(materiales && materiales.length>0){
	     			//inserto el nuevo punto de recoleccion
	     			models.punto_recoleccion.create({
						descripcion: descripcion_param,
						direccion: direccion_param,
						latitud: latitud_param,
						longitud : longitud_param,
						pais : pais_param,
						area : area_param,
						usuario_alta_id : usuario_param
					}).then(punto_creado => {
						punto_creado.addMateriales(materiales_param).then(materiales_asociados => {
							//busco el nuevo punto para devolverlo al frontend
							models.punto_recoleccion.findOne({ 
								where: {id: punto_creado.id}, 
								//campos específicos
								attributes: ['id','descripcion','direccion','latitud','longitud'],
								//asociaciones de las fk
								include: [
									{model: models.material, as: 'materiales', attributes:['id','descripcion']},
									{model: models.usuario, as: 'usuario_alta', attributes:['id','nombre','apellido']}
								]
							}).then(punto_nuevo => {
								res.send({status_code:200, punto: punto_nuevo});
							})
						})
					});
	     		}else{
	     			console.log('No hay materiales asociados al punto');
					res.send({status_code:404, mensaje:'No hay materiales asociados al punto'});
	     		}
	     	});
		}else{
			console.log('Usuario no encontrado');
			res.send({status_code:404, mensaje:'Usuario no encontrado'});
		}		
	});
});

//obtencion de reviews de punto
router.get('/review/:idParam', function(req, res, next) {
	var idParametro = req.params.idParam;
	
	models.punto_recoleccion.findOne({
		where : {id: idParametro}, 
		attributes: ['id'],
		//asociaciones
		include: [
			{
				model: models.opinion_punto_rec, 
				as: 'opiniones', 
				attributes:['id','puntuacion','comentario'],
				include: [
					model: models.usuario,
					as:'usuario',
					attributes:['id','nombre','apellido']
				]
			}
		]
	})
	.then(punto => {
		if(punto){
			res.setHeader('Content-Type', 'application/json');
			res.send({punto: punto, status_code:200});
		}else{
			console.log("pdr no encontrados");
	      	res.send({status_code:404, mensaje:'No hay resultados'});
		}
	});
});

//alta de review del punto
router.post('/review', function(req, res, next) {
	//TODO borrar el review anterior de ese usuario en ese punto, si existe
  	var usuario_param  = req.body.usuario;
  	var punto_rec_id_param = req.body.punto_rec_id;
  	var puntuacion_param = req.body.puntuacion; //boolean??
  	var comentario_param = req.body.comentario;

  	//busco usuario
  	models.usuario.findOne({ where: {id: usuario_param} }).then(user => {
    	if(user){
    		console.log('usuario encontrado!');
    		//busco punto
    		models.punto_recoleccion.findOne({ where: {id: punto_rec_id_param} }).then(punto => {
    			if(punto){
    				console.log('punto de recoleccion encontrado!');
    				if(punto.usuario_id != user.id){
	    				//valido si el usuario ya hizo una review del punto
	    				models.opinion_punto_rec.findOne({where: {usuario_id: user.id, punto_rec_id: punto.id}}).then(review => {
	    					if(review){
	    						console.log('El usuario '+user.id+' ya realizó una review para el punto '+punto.id);
	    						review.destroy();
	    					} 
							models.opinion_punto_rec.create({
									usuario_id: usuario_param,
									punto_rec_id: punto_rec_id_param,
									puntuacion: puntuacion_param,
									comentario : comentario_param
							}).then(function (result) {
								console.log('Transacción se completo exitosamente!');
								res.send({opinion: result , status_code:200, mensaje:'Opinion de punto de recoleccion insertada correctamente'});
							}).catch(function (err) {
								console.log('Error: ' + err);
								res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
							});
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

