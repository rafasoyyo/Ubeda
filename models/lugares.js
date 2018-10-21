var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lugarSchema = new Schema({
    "id"  : { type: 'String' },
    "name": { type: 'String' },
    "type": { type: 'String' },
    "info": { type: 'String' },
    "recomendation": { type: 'String' }
});

module.exports = {
    LosLugares : mongoose.model('LosLugares', lugarSchema),
    PaDormir : mongoose.model('padormir', lugarSchema),
    DeTuristeo : mongoose.model('Turisteo', lugarSchema),
    DeTapas : mongoose.model('detapas', lugarSchema)
}
