const mongoose = require('mongoose');
const { type } = require('os');
const schema = mongoose.Schema;
const reportSchema = new schema({
  author: { type: String },
  email: { type: String },
  uploadDate: { type: String },
  totalPercentage: { type: mongoose.Schema.Types.Decimal128 },
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

const report = mongoose.model('report', reportSchema);
module.exports = report;