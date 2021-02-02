const mongoose = require('mongoose');
const schema = mongoose.Schema;
const assignmentSchema = new schema({
    name: {type: String, required: true},
    dueDate: {type: Date, required: true},
    description: {type: String, required: true},
    authorID: {type: mongoose.Schema.Types.ObjectId, required: true},
    submittedStudentID: {type: mongoose.Schema.Types.ObjectId, required: true}
});

const assignment = mongoose.model('assignment', assignmentSchema);
module.exports = assignment;