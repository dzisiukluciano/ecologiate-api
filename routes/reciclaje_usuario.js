var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

router.get('/:code/:user/:puntorec/:cant', function(req, res, next) {
  var codeParam = req.params.code;
  var userParam = req.params.user;
  var puntorecParam= req.params.puntorec;
  var cantParam = req.params.cant;
  var itemObtenido;
  var materialObtenido;
  var userObtenido;

  models.usuario.findOne({ where: {id: userParam} }).then(user => {
    if(user){
      console.log("user found");
      user.statusCode = 200; //200 ok
      userObtenido = user.cant_medallas;
      //res.send(item);
    }else{
      console.log("user not found");
    }
  });

  models.Item.findOne({ include: [{ all: true }], where: {code: codeParam} }).then(item => {
    if(item){
      console.log("item found");
      item.statusCode = 200; //200 ok
      //itemObtenido = item;
      //inserto registro del reciclaje
      models.Reciclaje_usuario.create({
        usuario_id: userParam, 
        producto_id: codeParam,
        punto_rec_id: puntorecParam,
        cant_prod: cantParam,
        fecha : new Date() //revisar!!
      })
      //valido la cantidad de producto reciclado
      if(cantParam <= 0){
        cantParam = 1;
      }
      //envio respuesta
      res.send([
        userObtenido, //cantidad de medallas
        item.tipo_material.equ_arboles * item.cant_material * cantParam,
        item.tipo_material.equ_energia * item.cant_material * cantParam,
        item.tipo_material.equ_agua * item.cant_material * cantParam]);
      //res.send(item);
    }else{
      console.log("item not found");
    }
  });
});

module.exports = router;