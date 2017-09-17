var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;



router.post('/reciclar_producto', function(req, res, next) {
  var idProducto = req.body.product_id;
  var userParam = req.body.user;
  var puntorecParam= req.body.puntorec;
  var cantParam = req.body.cant;
  
//busco usuario
  models.usuario.findOne({ where: {id: userParam} }).then(user => {
    if(user){
      console.log('usuario encontrado!');
    
    //models.producto.belongsTo(models.materiales,{foreignKey: 'tipo_material', targetKey: 'id'});
    //models.materiales.hasMany(models.producto);
	
	//busco producto
    models.producto.findOne({ where: {id: idProducto} }).then(producto => {
      if(producto){
		    console.log('producto encontrado!');
		    models.materiales.findOne({ where: {id: producto.tipo_material} }).then(material => {
        if(material){
      			console.log('material encontrado!');
      			console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' reciclara el producto ' + producto.nombre_producto);
      			//inserto registro del reciclaje
            var respuesta = {};
            var puntosSumados = material.puntos * producto.cant_material * cantParam;
            respuesta = {
              status_code:200,
              puntos_anteriores: user.puntos,
              puntos_sumados: puntosSumados,
              equ_arboles: material.equ_arboles * producto.cant_material * cantParam,
              equ_energia: material.equ_energia * producto.cant_material * cantParam,
              equ_agua: material.equ_agua * producto.cant_material * cantParam
            };

      			sequelize.transaction(function (t) {
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
        			  
        			  //actualizo los puntos del usuario
        			  
        			  user.updateAttributes({puntos: user.puntos + puntosSumados});

      			});
          }).then(function (result) {
            console.log('Transacción se completo exitosamente!');
            console.log(respuesta);
            res.send(respuesta);
          }).catch(function (err) {
            console.log('Error: ' + err);
            res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
          });
        }else{
          console.log('Material no encontrado');
          res.send({status_code:404, mensaje:'Producto no encontrado'});
        }
		});
      }else{
        console.log('Producto no encontrado');
        res.send({status_code:404, mensaje:'Producto no encontrado'});
      }
    });

    }else{
      console.log('Usuario no encontrado');
      res.send({status_code:404, mensaje:'Usuario no encontrado'});
    }
  });
});

module.exports = router;