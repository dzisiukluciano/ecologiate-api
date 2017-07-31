var express = require('express');
var router = express.Router();
var models  = require('../models');
var restService = require('../services/restService');

/* GET items listing. */
router.get('/', function(req, res, next) {
  models.Item.findAll().then(function(data){
    res.send(data)
  });
});

router.get('/:code', function(req, res, next) {
  var codeParam = req.params.code;
  models.Item.findOne({ where: {code: codeParam} }).then(item => {
    if(item){
      console.log("item found");
      item.statusCode = 200; //200 ok
      res.send(item);
    }else{
      console.log("item not found");
      //completo info de apis
      restService.getJSON(codeParam, function(statusCode, result){
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
        models.Item.create({ 
          code: codeParam,
          title: 'Pending item '+codeParam,
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
