var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var lugarSchema = new Schema({
    "id"  : { type: 'String' },
    "name": { type: 'String' },
    "type": { type: 'String' },
    "info": { type: 'String' }
});

module.exports = mongoose.model('LosLugares', lugarSchema);
module.exports = mongoose.model('Turisteo', lugarSchema);
module.exports = mongoose.model('padormir', lugarSchema);
module.exports = mongoose.model('detapas', lugarSchema);