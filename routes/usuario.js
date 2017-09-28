var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

router.get('/:id_usuario', function(req, res, next) {
  var usuario_id = req.params.id_usuario;
  console.log(usuario_id);
	models.usuario.findOne({ 
		where: {id: usuario_id}, 
		//campos específicos
		attributes: ['id','nombre','apellido','puntos'],
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
	    	console.log("usuario encontrado");
	    	if(usuario.reciclajes != undefined && usuario.reciclajes.length>0){
	    		for (var i = 0; i < usuario.reciclajes.length; i++){
	    			arboles += usuario.reciclajes[i].producto.material.equ_arboles * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			agua += usuario.reciclajes[i].producto.material.equ_agua * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    			energia += usuario.reciclajes[i].producto.material.equ_energia * usuario.reciclajes[i].producto.cant_material * usuario.reciclajes[i].cant_prod;
	    		};
	    	}
	    	res.send({usuario: usuario.id, nivel: usuario.nivel, puntos: usuario.puntos, arboles: arboles, agua: agua, energia: energia , status_code:200});
	    }else{
	      console.log("usuario no encontrado");
	      res.send({status_code:404, mensaje:'Usuario no encontrado'});
	    }
  	});
});

module.exports = router;