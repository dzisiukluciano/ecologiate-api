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

router.post('/', function(req, res, next) {
	var materiales = req.body.materiales;
	var user = req.body.user;
	var latitud= req.body.latitud;
	var longitud = req.body.longitud;

	console.log("Body:");
	console.log(req.body);

	if(materiales != undefined && materiales.length > 0){
		for(var i = 0; i < materiales.length; i++){
			console.log("material: " + materiales[i]);
		}
	}
	res.send("tamo activo");
});

module.exports = router;


