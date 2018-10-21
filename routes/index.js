
var express = require('express');
var router = express.Router();

var Lugares = require('../models/lugares.js')
var LosLugares = Lugares.LosLugares;
var DeTuristeo = Lugares.DeTuristeo;
var PaDormir = Lugares.PaDormir;
var DeTapas = Lugares.DeTapas;
// console.log('Lugares -> ', Lugares);
// var places = require('./places');

// Object.keys(places).forEach(function(element) {
//   (places[element].places).forEach(function(place){
//     console.log('Lugares[element] -> ', Lugares[element]);

//     Lugares[element].create(place)
//   });
// });


var places = {
    LosLugares: {
        title: "Lugares de la boda",
    },
    PaDormir: {
        title: "Alojamientos",
    },
    DeTuristeo: {
        title: "Turismo",
    },
    DeTapas: {
        title: "Tapeo en Úbeda",
    }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


/* GET maps page. */
router.get('/sitios/:sitio', function(req, res, next) {

  Lugares[req.params.sitio].find(function(err, results) {
    console.log('results -> ', results);
    if (err) {
      res.render('error', {
        err: { status: err.id, stack: err.toString }
      });
    } else {
      res.render('maps', {
          title: places[req.params.sitio].title,
          places: results
      });
    }
  });

});

/* GET maps page. */
router.get('/nuevoinvitado', function(req, res, next) {
  res.render('nuevo_invitado', { title: 'Invitados' });
});

/* GET maps page. */
router.post('/nuevoinvitado', function(req, res, next) {


});
module.exports = router;
