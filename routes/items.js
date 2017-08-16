var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET items listing. */
router.get('/', function(req, res, next) {
  res.send("deprecada");
  models.Item.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:codeParam', function(req, res, next) {
  res.send("deprecada");
  var codeParametro = req.params.codeParam;
  models.Item.findOne({ where: {code: codeParametro} }).then(item => {  /*  el code es el de la entidad  */
    if(item){
      console.log("item found");
      item.statusCode = 200; //200 ok
      res.send(item);
    }else{
      console.log("item not found");
      //completo info de apis ----- esto seria para el item
      restService.getJSON(codeParametro, function(statusCode, result){
        var itemInfo = {};
        if(result.items != null && result.items.length > 0){
          var itemSearched = result.items[0];
          itemInfo.description = itemSearched.snippet;
          try{
            itemInfo.img_link = itemSearched.pagemap.cse_thumbnail[0].src;
          }catch(er){
            //do nothing Jon Snow
          }
        }
        models.Item.create({ /* sino lo encontro lo crea en pending  */ 
          code: codeParametro,
          title: 'Pending item '+codeParametro,
          manageable: false,
          status: 'PENDING',
          description: itemInfo.description,
          img_link: itemInfo.img_link
        })
      });
      res.send({statusCode:404, message:'Item not found, It will be created'});
    }
  });
});


module.exports = router;


