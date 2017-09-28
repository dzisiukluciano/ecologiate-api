var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET campanias listing. */
router.get('/', function(req, res, next) {
  models.campania.findAll({ where: {
  $and: [
    {
      fecha_inicio: {
        $lte: new Date()
      }
    },
    {
      fecha_fin: {
        $gte: new Date()
      }
    }
  ]
  }
})
  .then(function(data){
    res.send(data)
  });
});

module.exports = router;