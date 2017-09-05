var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// catch 404 and forward to error handler
/*
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});
*/

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

/********************************/
/********************************/
//recursos de la api
/********************************/
/********************************/
var index = require('./routes/index');
var users = require('./routes/users');
var items_service = require('./routes/items');
var producto_service = require('./routes/producto');
var pdr_service = require('./routes/puntos_recoleccion');
var reciclar_service = require('./routes/reciclaje_usuario');
var busqueda_manual_service = require('./routes/busqueda_manual');
var alta_producto_service = require('./routes/alta_producto');
var categoria_service = require('./routes/categoria');
var alta_punto_rec = require('./routes/alta_punto_rec');


app.use('/', index);
app.use('/api/users', users);
app.use('/api/items', items_service);
app.use('/api/producto', producto_service);
app.use('/api/pdr', pdr_service);
app.use('/api/reciclar', reciclar_service);
app.use('/api/busqueda_manual', busqueda_manual_service);
app.use('/api/alta_producto', alta_producto_service);
app.use('/api/categoria', categoria_service);
app.use('/api/alta_punto_rec', alta_punto_rec);

module.exports = app;
