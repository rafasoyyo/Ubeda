var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(function(req, res, next){
  if (req.hostname != 'localhost' && (req.get('X-Forwarded-Proto') === 'http' || req.protocol === 'http')) {
    return res.redirect(`https://${req.hostname}${req.url}`);
  } else {
    next();
  }
});

app.use('/.well-known/acme-challenge/iPIYe9fnfWQDAa_anA_rCBg8U8VmPSltrazs19dOxuY', express.static(path.join(__dirname, 'public', 'cert')));
app.use('/', require('./routes/index'));


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
