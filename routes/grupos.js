var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/:idParam', function(req, res, next) {
  var idParametro = req.params.idParam;
	models.usuario.findOne({ 
		where: {id: idParametro}, 
		attributes: ['id','nombre','apellido'],
		//asociaciones de las fk
		include:[
		{model: models.grupo, as: 'grupos', attributes: ['id','nombre'],
			include:[
			{model: models.usuario, as: 'usuarios', attributes: ['nombre','apellido','puntos'],
				include:[
				{model: models.reciclaje_usuario, as: 'reciclajes' , attributes: ['cant_prod'],
					include:[
					{model: models.producto, as: 'producto', attributes: ['nombre_producto','cant_material'],
						include:[
						{model: models.material, as: 'material', attributes: ['equ_arboles','equ_energia','equ_agua']
						}
						]
					}
					]
				}
				]
			}
			]
		}
		]  
	})
 .then(usuario => {  
	    if(usuario){
	    	var arboles = 0;
	    	var agua = 0;
	    	var energia = 0;
			var usuario_recorrido;
			var grupo_metricas;
			var grupos = [];
			var usuarios = [];
	    	console.log("usuario encontrado");
	    	if(usuario.grupos != undefined && usuario.grupos.length>0){
	    		for (var i = 0; i < usuario.grupos.length; i++){
					if(usuario.grupos[i].usuarios != undefined && usuario.grupos[i].usuarios.length>0){
						for (var j = 0; j < usuario.grupos[i].usuarios.length; j++){
							usuario_recorrido = usuario.grupos[i].usuarios[j];
							if(usuario_recorrido.reciclajes != undefined && usuario_recorrido.reciclajes.length>0){
								for (var z = 0; z < usuario_recorrido.reciclajes.length; z++){
									arboles += usuario_recorrido.reciclajes[z].producto.material.equ_arboles * usuario_recorrido.reciclajes[z].producto.cant_material * usuario_recorrido.reciclajes[z].cant_prod;
									agua += usuario_recorrido.reciclajes[z].producto.material.equ_agua * usuario_recorrido.reciclajes[z].producto.cant_material * usuario_recorrido.reciclajes[z].cant_prod;
									energia += usuario_recorrido.reciclajes[z].producto.material.equ_energia * usuario_recorrido.reciclajes[z].producto.cant_material * usuario_recorrido.reciclajes[z].cant_prod;
								};
							}
							usuarios.push({ usuario_id : usuario_recorrido.id, usuario_nombre: usuario_recorrido.nombre, usuario_apellido: usuario_recorrido.apellido, usuario_puntos : usuario_recorrido.puntos });
						};
					}
				
				grupo_metricas = {
							  id_grupo: usuario.grupos[i].id,
							  nombre_grupo: usuario.grupos[i].nombre,
							  usuarios: usuarios,
							  equ_arboles: arboles,
							  equ_energia: energia,
							  equ_agua: agua
							};
				grupos.push( grupo_metricas);
			    arboles = 0;
				agua = 0;
				energia = 0;
				usuarios = [];
	    		};
	    	}
	    	res.send({grupos, status_code:200});
	    }else{
	      console.log("usuario no encontrado");
	      res.send({status_code:404, mensaje:'Usuario no encontrado'});
	    }
  	});
});


router.post('/salir_grupo', function(req, res, next) {
  var idUsuario = req.body.usuario_id;
  var idGrupo = req.body.grupo_id;

  var grupo_a_salir;
  models.usuario.findOne({ 
		where: {id: idUsuario}, 
		attributes: ['id','nombre','apellido'],
		//asociaciones de las fk
		include:[
		{model: models.grupo, as: 'grupos', attributes: ['id','nombre'],
			include:[{model: models.usuario, as: 'usuarios', attributes: ['nombre','apellido','puntos']}]
		}
		]  
	})
 .then(usuario => {
 	if(usuario){
 		usuario.removeGrupos(idGrupo);
 		res.send({status_code: 200, mensaje: 'Ha salido del grupo'});
 	}else{
 		res.send({status_code: 404, mensaje: 'No se ha encontrado el usuario'});
 	}
 })

});

module.exports = router;