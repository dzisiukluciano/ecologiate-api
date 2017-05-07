//File: src/routes/items.js
module.exports = function(app) {

  var ItemModel = require('../models/item');

  //GET - Return all items in the DB
  findAllItems = function(req, res) {
  	ItemModel.find(function(err, items) {
  		if(!err) {
        console.log('GET /item')
  			res.send(items);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //GET - Return a Item with specified code
  findByCode = function(req, res) {
  	ItemModel.findOne({ 'code': req.params.code }, function(err, item) {
  		if(!err) {
        console.log('GET /item/' + req.params.code);
  			res.send(item);
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});
  };

  //POST - Insert a new Item in the DB
  addItem = function(req, res) {
  	console.log('POST');
  	console.log(req.body);

  	var item = new ItemModel({
  		title:    req.body.title,
  		code: 	  req.body.code,
  		number:  req.body.number,
  		manageable:   req.body.manageable 
  	});

  	item.save(function(err) {
  		if(!err) {
  			console.log('Created');
  		} else {
  			console.log('ERROR: ' + err);
  		}
  	});

  	res.send(item);
  };

  //PUT - Update a register already exists
  updateItem = function(req, res) {
  	ItemModel.findOne({ 'code': req.params.code }, function(err, item) {
  		item.title   = req.body.title;
  		item.code    = req.body.code;
  		item.number = req.body.number;
  		item.manageable  = req.body.manageable;
  		

  		item.save(function(err) {
  			if(!err) {
  				console.log('Updated');
  			} else {
  				console.log('ERROR: ' + err);
  			}
  			res.send(item);
  		});
  	});
  };

  

  //Link routes and functions
  app.get('/item', findAllItems);
  app.get('/item/:code', findByCode);
  app.post('/item', addItem);
  app.put('/item/:code', updateItem);

}