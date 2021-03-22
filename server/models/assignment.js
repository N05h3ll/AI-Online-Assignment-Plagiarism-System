const mongoose = require('mongoose');
const schema = mongoose.Schema;
const assignmentSchema = new schema({
    name: {type: String},
    dueDate: {type: Date},
    code: {type: String},
    description: {type: String},
    authorID: { type: mongoose.Schema.Types.ObjectId, ref:'user' },
    authorInstitution: { type: String },
    authorName: { type: String },
    courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
    submittedStudents: [{
        studentdID: { type: mongoose.Schema.Types.ObjectId, ref:'user' },
        studentdName: { type: String },
        submissionDate: { type: String},
        status: { type: String },
        reportID: { type: mongoose.Schema.Types.ObjectId, ref:'report' }
    }]
});

const assignment = mongoose.model('assignment', assignmentSchema);
module.exports = assignment;