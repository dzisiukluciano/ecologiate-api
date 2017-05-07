//var restful = require('node-restful');
var mongoose = require('mongoose'); // restful.mongoose;


var itemSchema = new mongoose.Schema({
	title: 		{ type: String },
	code: 		{ type: String, index: true },
	number: 	{ type: Number },
	manageable: { type: Boolean }
});


module.exports = mongoose.model('item', itemSchema);