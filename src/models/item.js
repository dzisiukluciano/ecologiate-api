//var restful = require('node-restful');
var mongoose = require('mongoose'); // restful.mongoose;


var itemSchema = new mongoose.Schema({
	title:  		{ type: String },
	code: 			{ type: String, index: true },
	manageable: 	{ type: Boolean },
	status: 		{ type: String, index: true},
	description: 	{ type: String },
	img_link: 		{ type: String }
});


module.exports = mongoose.model('item', itemSchema);