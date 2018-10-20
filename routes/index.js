
var express = require('express');
var router = express.Router();

var places = require('./places');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET maps page. */
router.get('/sitios/:sitio', function(req, res, next) {
  var item = places[req.params.sitio];
  res.render('maps', {
    title: item.title,
    places: item.places
  });
});


module.exports = router;
