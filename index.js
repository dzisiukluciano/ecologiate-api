// Dependencies
var express = require("express");
var bodyParser = require("body-parser");
var methodOverride = require("method-override");
var mongoose = require('mongoose');

// Connection to DB
mongoose.connect('mongodb://eco_admin:ecopass@ds117839.mlab.com:17839/ecologiate', function(err, res) {
  if(err) {
    console.error('Error connecting to Database: '+err);
    throw err;
  }
  console.log('Connected to Database');
});

// Middlewares
var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(methodOverride());

// Import Models and controllers
var ItemModel = require('./src/models/item');
//var ItemsController = require('./src/routes/items');

// Example Route
var testRouter = express.Router();
testRouter.get('/', function(req, res) {
  res.send("<h1>Ecologiate!</h1><br/>Use /api endpoint for requests.");
});
app.use(testRouter);

// API routes
var itemsRouter = express.Router();

itemsRouter.route('/item/:code')
  .get(function(req, res) {
    ItemModel.findOne({ code: req.params.code }, function(err, item) {
      if(!err) {
        console.log('GET /item/' + req.params.code);
        if(item){
          item.statusCode = 200; //200 ok
          res.send(item);
        }else{
          //res.send({'message':'No se encontró un item con el código '+req.params.code});
          //lo guardo como pending
          var newItem = new ItemModel({
            title: 'Item pending '+req.params.code,
            code: req.params.code,
            manageable: false,
            status: 'PENDING',
            description: 'Item pending '+req.params.code
          });

          //completo info de apis
          var options = {
              host: 'www.googleapis.com',
              https: true,
              path: '/customsearch/v1?'+
                'key=AIzaSyCExeME6nNWBsHRSAlAhGDXQ7UPZXdYu2s'+ //key de mi custom search
                '&cx=004997307265733943101%3Ayxvqxb5z0g0'+ //id del custom search
                '&q='+req.params.code, //query del buscador
              method: 'GET',
              headers: {
                  'Content-Type': 'application/json'
              }
          };

          var restService = require('./src/services/restService');
          restService.getJSON(options, function(statusCode, result){
              // I could work with the result html/json here.  I could also just return it
              console.log("onResult: (" + statusCode + ")");
              //actualizo mi item
              if(result.items != null && result.items.length > 0){
                var itemSearched = result.items[0];
                newItem.description = itemSearched.snippet;
                try{
                  newItem.img_link = itemSearched.pagemap.cse_thumbnail[0].src;
                }catch(er){
                  //nothing
                }
                
                newItem.save(function(err) {
                  if(!err) {
                    console.log('Created');
                  } else {
                    console.log('ERROR: ' + err);
                  }
                });
              }
          });

          newItem.save(function(err) {
            if(!err) {
              console.log('Created');
            } else {
              console.log('ERROR: ' + err);
            }
          });

          newItem.statusCode = 201; //created
          res.send(newItem);
        }
      } else {
        console.log('ERROR: ' + err);
      }
    });
  })
  .put(function(req, res) {
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
  });

itemsRouter.route('/item')
  .get(function(req, res) {
    ItemModel.find(function(err, items) {
      if(!err) {
        console.log('GET /item')
        res.send(items);
      } else {
        console.log('ERROR: ' + err);
      }
    });
  })
  .post(function(req, res) {
    console.log('POST');
    console.log(req.body);

    var item = new ItemModel({
      title:    req.body.title,
      code:     req.body.code,
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
  });

app.set('port', (process.env.PORT || 5000));
app.use('/api', itemsRouter);

// Start server
app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});