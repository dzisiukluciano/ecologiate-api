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
	console.log(materiales);

	var wherePdr = {}; //where sobre atributos del pdr
	if(area != undefined && area!=null && area.length >0){
		wherePdr.area = area;
	}
	if(pais != undefined && pais!=null && pais.length >0){
		wherePdr.pais = pais;
	}

	var whereMaterial = {}; //where sobre el join
	if(materialesParam != undefined && materialesParam!=null && materialesParam.length >0){
		var materiales = materialesParam.split(",");
		whereMaterial = { id: { $in : materiales } }
	}

	models.punto_recoleccion.findAll({
		//condiciones sobre el pdr
		where : wherePdr,
		attributes: ['id','descripcion','direccion','latitud','longitud'],
		//asociaciones con condiciones
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

