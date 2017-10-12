var express = require('express');
var router = express.Router();
var models  = require('../models');

/* GET categorias listing. */
router.get('/:idParam', function(req, res, next) {
  var idParametro = req.params.idParam;
	models.usuario.findOne({ 
		where: {id: idParametro}, 
		//campos específicos
		attributes: ['id','nombre','apellido'],
		//asociaciones de las fk
		include:[
			{model: models.grupo, as: 'grupos', 
				include:[
				{model: models.usuario, as: 'usuarios' }
				]
			}
			
		]  
	})
  .then(function(data){
    res.send(data)
  });
});


module.exports = router;