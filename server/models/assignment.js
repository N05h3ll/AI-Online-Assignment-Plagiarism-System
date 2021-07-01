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

assignmentSchema.post('remove', (doc) => {
    var reps = doc.submittedStudents.map((x) => { x.reportID })
    mongoose.model('report').find({ _id: { $in: reps } }, (error, repos) => {
        repos.forEach((rep) => {
            rep.remove();
        })
    })
    mongoose.model('course').findByIdAndUpdate(courseID, { $pull: { assignments: doc._id } }, (error, css) => {
        return
    })
});

const assignment = mongoose.model('assignment', assignmentSchema);
module.exports = assignment;