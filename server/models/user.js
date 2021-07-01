const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const assignment = require("./assignment");
const course = require('./course');
const report = require('./report.js')
const user = new schema({
  name: { type: String },
  email: { type: String },
  phone: { type: String },
  password: { type: String },
  accType: { type: String },
  active: { type: Boolean },
  institution: { type: String },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'report' }],
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'assignment' }],
  createdCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
  enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
  submittedAssignments: [
    {
      reportID: { type: mongoose.Schema.Types.ObjectId, ref: 'report' },
      assignmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'assignment' },
      submissionDate: { type: String },
      status: { type: String },
      assignmentName: { type: String },
      assignmentCode: { type: String },
      courseID: [{ type: mongoose.Schema.Types.ObjectId, ref: 'course' }],
    }
  ]
});

user.post('remove', (doc) => {
  course.deleteMany({ _id: { $in: doc.createdCourses } }, (error, delu) => {
    return
  })
  assignment.deleteMany({ _id: { $in: doc.assignments } }, (error, ass) => {
    return
  })
  report.deleteMany({ _id: { $in: doc.reports } }, (error, rep) => {
    return
  })
  if (doc.enrolledCourses.length !== 0) {
    course.find({ _id: { $in: doc.enrolledCourses } }, (error, po) => {
      if (error) { console.log(error) }
      po.forEach((item) => {
        item.enrolledStudents.pop(doc._id)
        item.save
      })
    })
  }
  if (doc.submittedAssignments.length !== 0) {
    assignment.find({ _id: { $in: doc.submittedAssignments.map(x => x.assignmentID) } }, (error, ass) => {
      if (error) { console.log(error) }
      ass.forEach((asmnt) => {
        assignment.updateMany({ }, { $pull: { submittedStudents: { studentdID: doc._id } } },{multi: true}, (error, upd) => {
          return
        })
      })
    })
  }
});

user.plugin(passportLocalMongoose, {
  usernameField: "email",
  usernameUnique: true,
  findByUsername: function (model, queryParameters) {
    queryParameters.active = true;
    return model.findOne(queryParameters);
  },
});

module.exports = mongoose.model("user", user);
