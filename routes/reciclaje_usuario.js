var express = require('express');
var router = express.Router();
var models  = require('../models');
var sequelize = models.sequelize;

//funcion que valida si una lista contiene un objeto
function contains(a, obj){
  if(a != undefined && a.length>0){
    for (var i = 0; i < a.length; i++){
      if (a[i] === obj){
        return true;
      }
    }
  }
  
  return false;

}

router.post('/reciclar_producto', function(req, res, next) {
  var idProducto = req.body.product_id;
  var userParam = req.body.user;
  var puntorecParam= req.body.puntorec;
  var cantParam = req.body.cant;

  console.log(req.body);

  var campanias_cumplidas = [];
  
//busco usuario
  models.usuario.findOne({ 
    where: {id: userParam},
    include:[
      {model: models.reciclaje_usuario, as: 'reciclajes', 
      include:[
        {model: models.producto, as: 'producto', 
        include:[
          {model: models.material, as: 'material'}
        ]}
      ]},
      {model: models.nivel, as: 'nivel'},
      {model: models.campania, as: 'campanias_cumplidas'},
      {model: models.objetivo, as: 'objetivos_cumplidos'},
      {model: models.medalla, as: 'medallas'}
    ]
    }).then(user => {
    if(user){
      console.log('usuario encontrado!');
	
	//busco producto
      models.producto.findOne({ 
        where: {id: idProducto}, 
        include: [
          {model: models.material, as:'material',
            include: [{model: models.campania, as: 'campanias', include:[{model: models.medalla, as: 'medalla'}]},
                      {model: models.objetivo, as: 'objetivos', include:[{model: models.medalla, as: 'medalla'}]}]},
          {model: models.campania, as: 'campanias',
            include: [{model: models.medalla, as: 'medalla'},{model: models.usuario, as: 'usuarios_cumplidores'}]},
          {model: models.objetivo, as: 'objetivos',
            include: [{model: models.medalla, as: 'medalla'},{model: models.usuario, as: 'usuarios_cumplidores'}]}
          ]}).then(producto => {
        if(producto){
  		    console.log('producto encontrado!');
        	console.log('El usuario ' + user.nombre + ' ' + user.apellido + ' reciclara el producto ' + producto.nombre_producto);
        	//inserto registro del reciclaje
          //valido la cantidad de producto reciclado
          if(cantParam <= 0){
            cantParam = 1;
          }
          var respuesta = {};
          var puntosSumados = producto.material.puntos_otorgados * producto.cant_material * cantParam;
          //busco nivel
          models.nivel.findOne({
            where: {$and: [{puntos_desde: {$lte: user.puntos + puntosSumados}}, 
                          {puntos_hasta: {$gt: user.puntos + puntosSumados}}]}
          }).then(nivel =>{
            if (nivel){
              //console.log(nivel);
              //cuento la cantidad de veces que reciclo el producto y material incluyendo este reciclaje
              console.log('Cuento la cantidad de producto y material reciclado hasta el momento');
              var cantidad_prod_reciclada = 1;//incluyo este reciclaje
              var cantidad_mat_reciclada = 1;//incluyo este reciclaje
              if(user.reciclajes != undefined && user.reciclajes.length>0){
                for (var i = 0; i < user.reciclajes.length; i++){
                  if(user.reciclajes[i].producto.id == idProducto){
                    cantidad_prod_reciclada += 1;
                  }
                  if(user.reciclajes[i].producto.material.id == producto.material.id){
                    cantidad_mat_reciclada += 1;
                  }
                };
              }
              console.log('Cantidad de producto que lleva reciclado: ' + cantidad_prod_reciclada);
              console.log('Cantidad de material que lleva reciclado: ' + cantidad_mat_reciclada);
              var medallas_nuevas = [];//guardo los id de medallas para insertar en la base
              var medallas_para_devolver = [];//guardo todos los datos de la medalla para devolver al front
              //valido si cumplio alguna campaña nueva
              var campanias_cumplidas = [];//guardo las campanias que acaba de cumplir
              console.log('Valido si cumplio alguna campaña');
              console.log('Valido campañas de producto');
              console.log('Cumplio ' + campanias_cumplidas.length +' campanias');
              //console.log(producto.campanias);
              //campaña de producto
              if(producto.campanias != undefined && producto.campanias.length>0){
                for (var i = 0; i < producto.campanias.length; i++){
                  if(producto.campanias[i].fecha_inicio <= new Date() &&
                    producto.campanias[i].fecha_fin > new Date() &&
                    producto.campanias[i].cant_meta == cantidad_prod_reciclada &&
                    !contains(producto.campanias[i].usuarios_cumplidores,user)){
                    //console.log(!contains(producto.campanias[i].usuarios_cumplidores,user));
                    //campanias_cumplidas.push(producto.campanias[i]);
                    campanias_cumplidas.push(producto.campanias[i].id);
                    medallas_nuevas.push(producto.campanias[i].medalla.id);
                    medallas_para_devolver.push(producto.campanias[i].medalla);
                  }
                };
              }
              console.log('Cumplio ' + campanias_cumplidas.length +' campanias');
              console.log('Valido campañas de material');
              //console.log(producto.material.campanias);
              //campaña de material
              if(producto.material.campanias != undefined && producto.material.campanias.length>0){
                for (var i = 0; i < producto.material.campanias.length; i++){
                  if(producto.material.campanias[i].fecha_inicio <= new Date() &&
                    producto.material.campanias[i].fecha_fin > new Date() &&
                    producto.material.campanias[i].cant_meta == cantidad_mat_reciclada &&
                    !contains(producto.material.campanias[i].usuarios_cumplidores,user)){
                    //campanias_cumplidas.push(producto.material.campanias[i]);
                    campanias_cumplidas.push(producto.material.campanias[i].id);
                    medallas_nuevas.push(producto.material.campanias[i].medalla.id);
                    medallas_para_devolver.push(producto.material.campanias[i].medalla);
                  }
                };
              }
              console.log('Cumplio ' + campanias_cumplidas.length +' campanias');
              console.log('Valido si cumplio algun objetivo');
              console.log('Valido objetivos de producto');
              //valido si cumplio algun objetivo nuevo
              var objetivos_cumplidos = [];
              //objetivo de producto
              if(producto.objetivos != undefined && producto.objetivos.length>0){
                for (var i = 0; i < producto.objetivos.length; i++){
                  if(producto.objetivos[i].cant_meta == cantidad_prod_reciclada &&
                    !contains(producto.objetivos[i].usuarios_cumplidores,user)){
                    //objetivos_cumplidos.push(producto.objetivos[i]);
                    objetivos_cumplidos.push(producto.objetivos[i].id);
                    medallas_nuevas.push(producto.objetivos[i].medalla.id);
                    medallas_para_devolver.push(producto.objetivos[i].medalla);
                  }
                };
              }
              console.log('Cumplio ' + objetivos_cumplidos.length +' objetivos');
              console.log('Valido objetivos de material');
              //objetivo de material
              if(producto.material.objetivos != undefined && producto.material.objetivos.length>0){
                for (var i = 0; i < producto.material.objetivos.length; i++){
                  if(producto.material.objetivos[i].cant_meta == cantidad_mat_reciclada &&
                    !contains(producto.material.objetivos[i].usuarios_cumplidores,user)){
                    //objetivos_cumplidos.push(producto.material.objetivos[i]);
                    objetivos_cumplidos.push(producto.material.objetivos[i].id);
                    medallas_nuevas.push(producto.material.objetivos[i].medalla.id);
                    medallas_para_devolver.push(producto.material.objetivos[i].medalla);
                  }
                };
              }
              console.log('Cumplio ' + objetivos_cumplidos.length +' objetivos');
                            
              respuesta = {
                status_code:200,
                puntos_anteriores: user.puntos,
                puntos_sumados: puntosSumados,
                equ_arboles: producto.material.equ_arboles * producto.cant_material * cantParam,
                equ_energia: producto.material.equ_energia * producto.cant_material * cantParam,
                equ_agua: producto.material.equ_agua * producto.cant_material * cantParam,
                medallas_ganadas: medallas_para_devolver,
                nivel: nivel
              };

              //console.log(medallas_nuevas);

              sequelize.transaction(function (t) {
                return models.reciclaje_usuario.create({
                  usuario_id: userParam, 
                  producto_id: producto.id,
                  punto_rec_id: puntorecParam,
                  cant_prod: cantParam
                }, {transaction: t})
                .then(reciclaje => {
                  console.log('actualizo puntos del usuario');
                  //actualizo los puntos del usuario y nivel (si no cambia queda el mismo)
                  return user.updateAttributes({puntos: user.puntos+puntosSumados},{transaction: t}).then(usuario => {
                    console.log('actualizo nivel del usuario');
                    return user.setNivel(nivel.id,{transaction: t}).then(usuario => {
                      console.log('actualizo medallas del usuario');
                      //agrego medallas nuevas
                      return user.addMedallas(medallas_nuevas, {transaction: t}).then(medallas_asociadas => {
                        //actualizo campanias cumplidas por el usuario
                        console.log('actualizo campanias del usuario');
                        return user.addCampanias_cumplidas(campanias_cumplidas,{transaction: t}).then(campanias_asociadas => {
                          //actualizo objetivos cumplidos por el usuario
                          console.log('actualizo objetivos del usuario');
                          return user.addObjetivos_cumplidos(objetivos_cumplidos);
                        })
                      });
                    });
                  });
               });
              }).then(function (result) {
                console.log('Transacción se completo exitosamente!');
                console.log(respuesta);
                res.send(respuesta);
              }).catch(function (err) {
                console.log('Ha ocurrido un error en la transacción');
                console.log('Error: ' + err);
                res.send({status_code:404, mensaje:'Ha ocurrido un error al realizar la operación'});
              });
            }else{
              console.log('Nivel no encontrado');
              res.send({status_code:404, mensaje:'Nivel no encontrado'});
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