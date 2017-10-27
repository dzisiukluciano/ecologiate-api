var express = require('express');
var router = express.Router();
var models  = require('../models');

function randomIntInc (low, high) {
    return Math.floor(Math.random() * (high - low + 1) + low);
}

/* GET categorias listing. */
router.get('/', function(req, res, next) {
  models.trivia_pregunta.findAll({
		attributes: ['id','descripcion','explicacion','imagen','respuesta_correcta_id'],
		//asociaciones de las fk
		include:[
		{model: models.trivia_respuesta, as: 'respuesta_correcta'
		}
		] 
  })
 .then(trivia => {  
	    if(trivia){
			var trivia_final = [];
			var ramdom = 0;
	    	if(trivia != undefined && trivia.length > 0){
	    		for (var i = 0; i < 5; i++){
					ramdom = randomIntInc(0 , trivia.length -1);
					trivia_final.push(trivia[ramdom]);
					trivia.splice(ramdom, 1);
	    		};
	    	}
	    	res.send({trivia_final, status_code:200});
	    }else{
	      console.log("trivia no encontrada");
	      res.send({status_code:404, mensaje:'trivia no encontrada'});
	    }
  	});
});

module.exports = router;