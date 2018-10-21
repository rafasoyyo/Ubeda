
var express = require('express');
var router = express.Router();


var Invitados = require('../models/invitados.js');
var Lugares = require('../models/lugares.js');
var LosLugares = Lugares.LosLugares;
var DeTuristeo = Lugares.DeTuristeo;
var PaDormir = Lugares.PaDormir;
var DeTapas = Lugares.DeTapas;


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


/* GET invitados page. */
router.get('/invitado', function(req, res, next) {
  res.render('nuevo_invitado', { title: 'Invitados' });
});


/* POST invitados page. */
router.post('/invitado', function(req, res, next) {
    console.log(req.body)
    Invitados.findOneAndUpdate({ telefono: req.body.telefono }, req.body, { upsert: true }, function(err, result){
      if (err) {
        var error = err.toString();
      }
      res.render('nuevo_invitado', { title: 'Invitados', error: error, invitado: req.body.nombre });
    })
});


/* GET lista invitados page. */
router.get('/invitados', function(req, res, next) {
    Invitados.find({ }, function(err, result){
      res.render('lista_invitados', { title: 'Invitados', invitados: result });
    });
});


module.exports = router;
