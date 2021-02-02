const mongoose = require('mongoose');
const schema = mongoose.Schema;
const documentTypeSchema = new schema({
    type: {
    1: {type: String, required:true, default:"ms-word"},
    2: {type: String, required:true, default:"pdf"}
    }
});

const documentType = mongoose.model('documentType', documentTypeSchema);
module.exports = documentType;