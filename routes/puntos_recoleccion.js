var express = require('express');
var router = express.Router();
var models  = require('../models');

/* examples
	/api/pdr     => devuelve todos los pdr
	/api/pdr?materiales=1,2,3   => devuelve los pdr para materiales con id 1, 2 y 3
*/
router.get('/', function(req, res, next) {
	console.log('Búsqueda de puntos de recolección');
	var materiales = req.query.materiales;
	if(materiales){
		console.log('materiales = '+materiales);
		//TO DO: búsqueda filtrada por materiales
	}
	models.puntos_recoleccion.findAll().then(function(data){
		res.send(data)
	});
});


module.exports = router;


