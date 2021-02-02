const mongoose = require("mongoose");
const schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");
const user = new schema({
  name: { type: String },
  email: { type: String },
  password: { type: String },
  accType: { type: String },
  active: { type: Boolean },
  institution: { type: String },
  reports: [{ type: mongoose.Schema.Types.ObjectId, ref: 'report' }]
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
