const mongoose = require('mongoose');
const schema = mongoose.Schema;
const documentSchema = new schema({
    name: {type: String},
    authorID: {type: mongoose.Schema.Types.ObjectId},
    assignmentID: {type: mongoose.Schema.Types.ObjectId},
    URL: {type: String},
    charCount: {type: mongoose.Schema.Types.Decimal128},
    size: {type: mongoose.Schema.Types.Decimal128},
    docType: {type: String}
});

const document = mongoose.model('document', documentSchema);
module.exports = document;