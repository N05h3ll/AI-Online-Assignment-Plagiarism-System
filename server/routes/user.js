const express = require('express');
const router = express.Router()
const utils = require('../utils')
const passport = require('passport')
const User = require('../models/user')
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OAPSEMAIL,
    pass: process.env.OAPSPASSWORD
  }
});
router.post("/register", async (req, res) => {
  if (
    req.body.firstName &&
    req.body.lastName &&
    req.body.accType &&
    req.body.email &&
    req.body.password &&
    req.body.institution
  ) {
    let activeState = true;
    let userExists = false;
    let dbError = false;
    if (
      req.body.accType == "Module Coordinator" ||
      req.body.accType == "Teacher Assistant"
    ) {
      activeState = false;
    } else {
      activeState = true;
    }
    await User.findOne({ email: req.body.email }, (err, user) => {
      if (err) {
        return (dbError = true);
      } else if (user) {
        return (userExists = true);
      }
    });
    if (dbError) {
      return res.status(500).send({ error: "Internal Server Error!" });
    } else if (userExists) {
      return res.status(401).send({ error: "Email already exists!" });
    } if (!dbError && !userExists) {
      User.register(
        new User({
          email: req.body.email,
          active: activeState,
          name: req.body.firstName + " " + req.body.lastName,
          accType: req.body.accType,
          institution: req.body.institution,
        }),
        req.body.password,
        async (err) => {
          if (err) {
            return res.status(500).send({ error: "Email already exists!" });
          } else {
            var mailOptions = {
              from: 'no.reply.oaps@gmail.com',
              to: req.body.email,
              subject: 'OAPS Registeration Confirmation',
              html: `<h1>Welcome to OAPS</h1>\
              </br>
              <h3>Your account has been registered with this information:</h3>
              Name: `+req.body.firstName+' '+req.body.lastName+`</br>
              Email: `+req.body.email+`</br>
              Account Type: `+req.body.accType+`</br>
              Institution: `+req.body.institution
            };
            transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            }); 
            return res.status(201).send("User Created.");
          }
        }
      );
    }
  } else {
    res.status(422).send("Unprocessable Entity! Missing user data.");
  }
});

router.post("/login", function (req, res, next) {
  passport.authenticate("local", function (err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      res
        .status(401)
        .send({ error: "Incorrect email or passowrd, Please try again." });
    }
    req.logIn(user, function (err) {
      if (err) {
        return next(err);
      }
      return res.status(200).send({ success: "TRUE", user: user });
    });
  })(req, res, next);
});


router.get('/user', utils.isLoggedIn, async (req,res)=>{
  // console.log(req.session.passport.user)
  let user = await User.findOne({email: req.session.passport.user}, (err, user)=>{
    if (err){return err}else if(user){
      return user
    }
  })
  console.log(user)
  res.send(user)
})

router.get('/logout', (req, res)=>{
  console.log(req.session)
  req.logout();
  res.send()
})


module.exports = router;