var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET items listing. */
router.get('/', function(req, res, next) {
  models.producto.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:codeParam', function(req, res, next) {
  var codeParametro = req.params.codeParam;
  models.producto.findOne({ where: {codigo_barra: codeParametro} }).then(producto => {  /*  el code es el de la entidad  */
    if(producto){
      console.log("producto encontrado");
      producto.status_code = 200; //200 ok
      res.send(producto);
    }else{
      console.log("producto no encontrado");
      res.send({status_code:404, mensaje:'Producto no encontrado'});
    }
  });
});


module.exports = router;


