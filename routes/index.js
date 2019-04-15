var express = require('express');
var router = express.Router();
var path = require('path');

var env = process.env.NODE_ENV;

var Bot = require('telegram-api').default;
var Message = require('telegram-api/types/Message');
var bot = new Bot({ token: '654952867:AAFnJPiqAq463C2QLGUSknP_vEoHlA60ap8' });

var Invitados = require('../models/invitados.js');
var Lugares = require('../models/lugares.js');
var LosLugares = Lugares.LosLugares;
var DeTuristeo = Lugares.DeTuristeo;
var PaDormir = Lugares.PaDormir;
var DeTapas = Lugares.DeTapas;

var places = {
    LosLugares: {
        title: "Los lugares de la boda"
    },
    PaDormir: {
        title: "¿Dónde alojarse?"
    },
    DeTuristeo: {
        title: "¿Qué ver en Úbeda?"
    },
    DeTapas: {
        title: "De tapeo y de compras"
    }
}


/*
        TELEGRAM BOT
*/

/* Sent BOT message */
var sendMessage = function(id, message) {
    var answer = new Message().text(message).to(id);
    bot.send(answer);
};

/* Start bot */
bot.start();

/* Manage bot errors */
bot.on('error', function(e) {
    console.error( 'Telegram Error: ', e.body );
});

/* GET user bot id */
bot.get('/id', function(message) {
    console.log('id: ', message.chat.id);
    sendMessage(message.chat.id, 'id: ' + message.chat.id );
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


/*
        EXPRESS
*/

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', {
        title: 'Express',
        now: new Date().toISOString(),
        page: { name: 'home' },
        env: env,
        manifest: true
    });
});

/* GET home page. */
router.get('/lunademiel', function(req, res, next) {
    console.log(env);
    res.render('lunademiel', {
        title: 'Luna de Miel',
        now: new Date().toISOString(),
        page: { name: 'lunademiel' },
        env: env,
        manifest: true
    });
});

/* GET maps page. */
router.get('/sitios/:sitio', function(req, res, next) {
    Lugares[req.params.sitio].find(function(err, results) {
        if (err) {
            res.render('error', {
                err: { status: err.id, stack: err.toString }
            });
        } else {
            var pageName = places[req.params.sitio].title;
            res.render('maps', {
                title: pageName,
                now: new Date().toISOString(),
                page: { name: pageName },
                places: results,
                env: env,
                manifest: true
            });
        }
    });
});

/* GET invitados page. */
router.get('/invitado', function(req, res, next) {
    res.render('nuevo_invitado', {
        title: 'Invitados',
        now: new Date().toISOString(),
        page: { name: 'home' },
        env: env,
        manifest: true
    });
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
        res.render('nuevo_invitado', {
            title: 'Invitados',
            now: new Date().toISOString(),
            error: error,
            invitado: req.body.nombre,
            env: env,
            manifest: true
        });
    })
});

/* GET lista invitados page. */
router.get('/guests', function(req, res, next) {
    Invitados
        .find()
        // .sort({'nombre': 1})
        .exec(function(err, result){
            console.error(err)
            res.render('lista_invitados', {
                title: 'Invitados',
                now: new Date().toISOString(),
                invitados: result,
                env: env,
                manifest: false
            });
    });
});


module.exports = router;
