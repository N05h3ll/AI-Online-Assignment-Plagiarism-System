const mongoose = require('mongoose');
const { type } = require('os');
const schema = mongoose.Schema;
const assignment = require('./assignment');
// const user = require("./user");
const reportSchema = new schema({
  author: { type: String },
  email: { type: String },
  uploadDate: { type: String },
  totalPercentage: { type: mongoose.Schema.Types.Decimal128 },
  previousPercentage: { type: mongoose.Schema.Types.Decimal128 },
  status: { type: String },
  isSecondTrial: { type: Boolean },
  fileName: { type: String },
  assignmentName: { type: String },
  assignmentCode: { type: String },
  assignmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'assignment' },
  courseID: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
  baseParagraph: 
    {
      type: [{
        baseSentence: { type: String },
        active: { type: Boolean },
        percentage: { type: mongoose.Schema.Types.Decimal128 },
        url: { type: String },
      }],
    }, 
});

reportSchema.post('remove', (doc) => {
  mongoose.model('user').findOneAndUpdate({ email: doc.email }, { $pull: { submittedAssignments: { reportID: doc._id } } }, { multi: true }, (error, done) => {
    return
  })
  assignment.findByIdAndUpdate(doc.assignmentID, { $pull: { submittedStudents: { reportID: doc._id } } }, { multi: true }, (error, done) => {
    return
  })
})

const report = mongoose.model('report', reportSchema);
module.exports = report;