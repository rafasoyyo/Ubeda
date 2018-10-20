var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var invitadoSchema = new Schema({
    "nombre"  : { type: 'String' },
    "telefono": { type: 'String' },
    "adultos" : { type: 'String' },
    "niños"   : { type: 'String' },
    "viernes" : { type: 'Boolean' },
    "domingo" : { type: 'Boolean' },
    "comentarios" : { type: 'String' }
});

module.exports = mongoose.model('Invitados', invitadoSchema);