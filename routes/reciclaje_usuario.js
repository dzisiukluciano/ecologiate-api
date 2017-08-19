var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('Deprecada');
});

router.get('/:code/:user/:puntorec/:cant', function(req, res, next) {
  var codeParam = req.params.code;
  var userParam = req.params.user;
  var puntorecParam= req.params.puntorec;
  var cantParam = req.params.cant;
  
//busco usuario
  models.usuario.findOne({ where: {id: userParam} }).then(user => {
    if(user){
      console.log('usuario encontrado!');
      user.statusCode = 200; //200 ok
    
    //models.producto.belongsTo(models.materiales,{foreignKey: 'tipo_material', targetKey: 'id'});
    //models.materiales.hasMany(models.producto);
	
	//busco producto
    models.producto.findOne({ where: {codigo_barra: codeParam} }).then(producto => {
      if(producto){
		console.log('producto encontrado!');
		models.materiales.findOne({ where: {id: producto.tipo_material} }).then(material => {
			console.log('material encontrado!');
			producto.statusCode = 200; //200 ok
			console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' reciclara el producto ' + producto.nombre_producto);
			//inserto registro del reciclaje
			models.reciclaje_Usuario.create({
			  usuario_id: userParam, 
			  producto_id: producto.id,
			  punto_rec_id: puntorecParam,
			  cant_prod: cantParam,
			  fecha : new Date() //revisar!!
			}).then(() => {
			  //valido la cantidad de producto reciclado
			  if(cantParam <= 0){
				cantParam = 1;
			  }

			  //armo respuesta 
			  var respuesta = {};
			  
			  console.log(producto.tipo_material.puntos);
			  console.log(producto.cant_material);
			  console.log(cantParam);
			  /*
			  respuesta.set('puntos_anteriores',user.puntos);
			  respuesta.set('puntos_sumados', producto.tipo_material.puntos * producto.cant_material * cantParam);
			  respuesta.set('equ_arboles',producto.tipo_material.equ_arboles * producto.cant_material * cantParam);
			  respuesta.set('equ_energia',producto.tipo_material.equ_energia * producto.cant_material * cantParam);
			  respuesta.set('equ_agua',producto.tipo_material.equ_agua * producto.cant_material * cantParam);
			  */
			  respuesta.puntos_anteriores = user.puntos;
			  respuesta.puntos_sumados = producto.cant_material * cantParam;
			  respuesta.equ_arboles = producto.cant_material * cantParam;
			  respuesta.equ_energia = producto.cant_material * cantParam;
			  respuesta.equ_agua = producto.cant_material * cantParam;

			  //actualizo los puntos del usuario
			  
			  user.updateAttributes({puntos: user.puntos + producto.cant_material * cantParam})
			  .then((self) => {
				  console.log(respuesta);
				  res.send(respuesta);
					//return self;
			  }).catch(e => {
				console.log('Error al actualizar puntos del usuario.\n' + e);
			  });
			  //.success(console.log("se actualizaron los puntos del usuario correctamente");

			});
		});


      }else{
        console.log('producto no encontrado');
        res.send('Producto no encontrado');
      }
    });

    }else{
      console.log('usuario no encontrado');
      res.send('Usuario no encontrado');
    }
  });
});

module.exports = router;