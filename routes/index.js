
var express = require('express');
var router = express.Router();

var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');
var bot = new Bot({ token: '654952867:AAFnJPiqAq463C2QLGUSknP_vEoHlA60ap8' });
bot.start();

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
        title: "Tapeo y Compras",
    }
}


// Sent BOT message
var sendMessage = function(id, message) {
    var answer = new Message().text(message).to(id);
    bot.send(answer);
};


/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});


/* GET maps page. */
router.get('/sitios/:sitio', function(req, res, next) {
    Lugares[req.params.sitio].find(function(err, results) {
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
    Invitados.findOneAndUpdate({ telefono: req.body.telefono }, req.body, { new: true, upsert: true }, function(err, result){
        if (err) {
            var error = err.toString();
        }
        // María - 7833074, Rafael - 29399890
        sendMessage(7833074, 'Nuevo invitado registrado: ' + result.nombre );
        sendMessage(29399890, 'Nuevo invitado registrado: ' + result.nombre );
        res.render('nuevo_invitado', { title: 'Invitados', error: error, invitado: req.body.nombre });
    })
});


/* GET lista invitados page. */
router.get('/guests', function(req, res, next) {
    Invitados.find({ }, function(err, result){
        res.render('lista_invitados', { title: 'Invitados', invitados: result });
    });
});


/* GET reiniciar bot. */
router.get('/bot', function(message) {
    bot.start();
});


/* GET lista invitados from bot. */
bot.get('/guests', function(message) {
    if (message.chat.id == 29399890 || message.chat.id == 7833074) {
        var text = 'Lista de invitados: \n';
        Invitados.find({ }, 'nombre', function(err, results){
            if(err) {
                console.error('Error buscando invitados: ', err.toString());
            } else {
                for(var i=0, ilen=results.length; i<ilen; i++ ) {
                    text += results[i].nombre + '\n';
                }
                sendMessage(message.chat.id, text);
                sendMessage(message.chat.id, 'Ver todos los datos \n https://mariayrafael.family/guests' );
            }
        });
    } else {
        console.log('No valida: ', message.chat.id);
        sendMessage(message.chat.id, 'Not allowed' );
    }
});


/* GET user bot id */
bot.get('/id', function(message) {
    console.log('id: ', message.chat.id);
    sendMessage(message.chat.id, 'id: ' + message.chat.id );
});


module.exports = router;
