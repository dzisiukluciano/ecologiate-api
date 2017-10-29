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

//para servir imágenes
app.use('/images', express.static('images'))

/********************************/
/********************************/
//recursos de la api
/********************************/
/********************************/
var index = require('./routes/index');
var items_service = require('./routes/items');
var producto_service = require('./routes/producto');
var pdr_service = require('./routes/puntos_recoleccion');
var reciclar_service = require('./routes/reciclaje_usuario');
var alta_producto_service = require('./routes/alta_producto');
var categoria_service = require('./routes/categoria');
var material_service = require('./routes/materiales');
var usuario_service = require('./routes/usuario');
var campania_service = require('./routes/campania');
var grupos_service = require('./routes/grupos');
var campanias_completas_service = require('./routes/campanias_completas');
var trivia_service = require('./routes/trivia');
var objetivo_service = require('./routes/objetivo');

app.use('/', index);
app.use('/api/items', items_service);
app.use('/api/producto', producto_service);
app.use('/api/pdr', pdr_service);
app.use('/api/reciclar', reciclar_service);
app.use('/api/alta_producto', alta_producto_service);
app.use('/api/categoria', categoria_service);
app.use('/api/material', material_service);
app.use('/api/usuario', usuario_service);
app.use('/api/campania', campania_service);
app.use('/api/grupos', grupos_service);
app.use('/api/campanias_completas', campanias_completas_service);
app.use('/api/trivia', trivia_service);
app.use('/api/objetivo', objetivo_service);

module.exports = app;
