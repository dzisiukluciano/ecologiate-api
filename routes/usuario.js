var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/metricas/:id_usuario', function(req, res, next) {
  var usuario_id = req.params.id_usuario;
  console.log(usuario_id);
	models.usuario.findOne({ 
		where: {id: usuario_id}, 
		//campos específicos
		attributes: ['id','puntos'],
		//asociaciones de las fk
		include:[
			{model: models.reciclaje_usuario, as: 'reciclajes', 
			include:[
				{model: models.producto, as: 'producto', 
				include:[
					{model: models.material, as: 'material'}
				]}
			]},
			{model: models.nivel, as: 'nivel'}
		] 
	})
	.then(usuario => {  
	    if(usuario){
	    	var arboles = 0;
	    	var agua = 0;
	    	var energia = 0;
	    	var emisiones = 0;
	    	console.log("usuario encontrado");
	    	if(usuario.reciclajes != undefined && usuario.reciclajes.length>0){
	    		for (var i = 0; i < usuario.reciclajes.length; i++){
	    			arboles += usuario.reciclajes[i].producto.material.equ_arboles * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			agua += usuario.reciclajes[i].producto.material.equ_agua * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			energia += usuario.reciclajes[i].producto.material.equ_energia * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			emisiones += usuario.reciclajes[i].producto.material.equ_emisiones * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    		};
	    	}
	    	res.send({usuario: usuario.id, nivel: usuario.nivel, puntos: usuario.puntos, arboles: arboles, agua: agua, energia: energia , emisiones: emisiones, status_code:200});
	    }else{
	      console.log("usuario no encontrado");
	      res.send({status_code:404, mensaje:'Usuario no encontrado'});
	    }
  	});
});



//por ahora lo hacemos así, luego a futuro valido el token
router.put('/login', function(req, res, next) {
	var email = req.body.email;
  	var nombre = req.body.nombre;
  	var apellido = req.body.apellido;
  	var token  = req.body.token;

	//busco si existe por mail
 	models.usuario.findOne({ 
 		where: {mail: email},
 		attributes: ['id','puntos','nombre','apellido','mail','admin','nivel_id'],
 		include:[
			{
				model: models.reciclaje_usuario, as: 'reciclajes', 
				include:[
					{model: models.producto, as: 'producto', 
					include:[
						{model: models.material, as: 'material'}
					]}
				]
			},
			{model: models.nivel, as: 'nivel'},
			{model: models.token, as: 'tokens'},
			{
				model: models.objetivo, as: 'objetivos_cumplidos',
				include:[
					{model: models.material, as:'material', attributes:['id','descripcion']},
					{model: models.producto, as:'producto', attributes:['id','nombre_producto']},
					{model: models.medalla, as:'medalla'}
				]
			},
			{
				model: models.campania, as: 'campanias_cumplidas',
				include:[
					{model: models.material, as:'material', attributes:['id','descripcion']},
					{model: models.producto, as:'producto', attributes:['id','nombre_producto']},
					{model: models.medalla, as:'medalla'}
				]
			}
		]
 	})
 	.then(usuario => {
	    if(usuario){
	     	console.log('usuario encontrado!');
	     	var arboles = 0;
	    	var agua = 0;
	    	var energia = 0;
	    	var emisiones = 0;
	    	var reciclajes_filtrados = [];
	    	if(usuario.reciclajes != undefined && usuario.reciclajes.length>0){
	    		for (var i = 0; i < usuario.reciclajes.length; i++){
	    			arboles += usuario.reciclajes[i].producto.material.equ_arboles * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			agua += usuario.reciclajes[i].producto.material.equ_agua * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			energia += usuario.reciclajes[i].producto.material.equ_energia * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			emisiones += usuario.reciclajes[i].producto.material.equ_emisiones * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    		};
	    		//achico el json de reciclajes porque no me interesa devolverlo
	    		reciclajes_filtrados = usuario.reciclajes.map(mapReciclaje);
	    	}
	    	res.send({
	    		usuario: {id:usuario.id,puntos:usuario.puntos,nombre:usuario.nombre,apellido:usuario.apellido,mail:usuario.mail,
	    			admin:usuario.admin,reciclajes:reciclajes_filtrados,nivel:usuario.nivel,tokens:usuario.tokens,objetivos_cumplidos:usuario.objetivos_cumplidos,
	    			campanias_cumplidas:usuario.campanias_cumplidas
	    		}, 
	    		impacto: {arboles:arboles, agua:agua, energia:energia, emisiones:emisiones}, 
	    		status_code:200
	    	});
		}else{
			console.log('Usuario no encontrado');
			//lo creo
			models.usuario.create({
				nombre: nombre,
				apellido: apellido,
				mail: email,
				puntos : 0,
				admin : false,
				nivel_id : 1 //ATENTI CON ESTO, SI NO CAMBIA EL ID FUNCIONA, SINO LO TENGO QUE TRAER DE LA BD
			})
			.then(new_user => {
				models.token.create({
				  valor: token,
				  tipo: 'AUTH'
				})
				.then(token_creado => {
					new_user.addTokens([token_creado]).then(tokens_asociados => {
						//busco el nuevo usuario para devolverlo al frontend
						models.usuario.findOne({ 
							where: {mail: email},
							//asociaciones de las fk
							include:[
								{model: models.reciclaje_usuario, as: 'reciclajes'},
								{model: models.nivel, as: 'nivel'},
								{model: models.token, as: 'tokens'},
								{model: models.objetivo, as: 'objetivos_cumplidos'},
								{model: models.campania, as: 'campanias_cumplidas'}
							]
						}).then(user_creado => {
							res.send({usuario: user_creado, impacto: {arboles:0, agua:0, energia:0, emisiones:0}, status_code:200});
						})
					})
				});
			});

		}		
	});
});

function mapReciclaje(e, index){
	var reciclaje = {id:e.id, cant_prod:e.cant_prod, punto_rec_id: e.punto_rec_id, producto:{id:e.producto.id, nombre_producto:e.producto.nombre_producto}};
	return reciclaje;
}

module.exports = router;