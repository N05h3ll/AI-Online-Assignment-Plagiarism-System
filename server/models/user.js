const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const assignment = require("./assignment");
const user = new schema({
  name: { type: String },
  email: { type: String },
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
      assignmentID: { type: mongoose.Schema.Types.ObjectId, ref: 'assignment' },
      submissionDate: { type: String },
      status: { type: String },
      assignmentName: { type: String },
      assignmentCode: { type: String },
    }
  ]
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
