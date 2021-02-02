const express = require("express");
const app = express();
const axios = require("axios");
const cheerio = require("cheerio");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
app.use(cors({origin: [
  'http://localhost:8080',
  'http://127.0.0.1:8080'
],credentials: true,
  exposedHeaders: ['set-cookie']}));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())
let LocalStrategy = require("passport-local"),
  passport = require("passport"),
  User = require("./models/user"),
  passportLocalMongoose = require("passport-local-mongoose");
// const user = require("./models/user");
const report = require("./models/report");
// setup sessions
app.use(
  require("express-session")({
    secret: "OAPS Secret Token",
    resave: false,
    saveUninitialized: false,
  })
);
// connect to db
mongoose.connect("mongodb://localhost/test", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function () {
  console.log("CONNECTED TO THE DATABASE!!");
});
// configure passport
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
const userRoute = require('./routes/user')
const reportRoute = require('./routes/report')
app.get("/", (req, res) => {
  res.send("GET")
});

app.use('/api/user', userRoute);
app.use('/api/report', reportRoute)
app.post('/api/addreport', (req,res)=>{
  console.log(req.body)
  rep = new report(req.body);

  rep.save((err, report) => {
    if (err) {console.log(err)}
    // console.log(report)
    // console.log(report)
    User.findOneAndUpdate({email: req.body.email}, {$push: {reports: report._id}}, (err)=>{
      if(err){console.log(err)}
      res.send('done')
    })
  });

})
app.listen(3000, () => {
  console.log("app listining on 127.0.0.1:3000");
});
