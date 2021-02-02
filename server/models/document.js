const mongoose = require('mongoose');
const schema = mongoose.Schema;
const documentSchema = new schema({
    name: {type: String, required: true},
    authorID: {type: mongoose.Schema.Types.ObjectId, required: true},
    assignmentID: {type: mongoose.Schema.Types.ObjectId},
    URL: {type: String, required: true},
    charCount: {type: mongoose.Schema.Types.Decimal128, required:true},
    size: {type: mongoose.Schema.Types.Decimal128, required:true},
    docType: {type: Number, required: true}
});

const document = mongoose.model('document', documentSchema);
module.exports = document;