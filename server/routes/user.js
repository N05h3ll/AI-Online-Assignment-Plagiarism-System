const express = require('express');
const router = express.Router()
const utils = require('../utils')
const passport = require('passport')
const User = require('../models/user')
require('dotenv').config()
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
    } else {
    req.logIn(user, async function (err) {
      if (err) {
        return res.status(401).send('Eror while loging you in, please try again later.')
      } else if (!err) {
          await User.findOne({ email: user.email }).
    populate('assignments').
    populate('reports').
    populate('submittedAssignments').populate('createdCourses').
    populate('enrolledCourses').
    exec(async (error, found) => {
    if (error) {
      res.status(401).send('NO USER FOUND!')
    } else if (found) {
      await User.populate(found, { path: 'submittedAssignments', populate: 'reportID' }, (error, popFound) => {
        if (error) { return res.status(500).send('Internal Server Error!') }
        return res.status(200).send({ success: "TRUE", user: popFound });
      })
    }
  })
      }
    });
  }
  })(req, res, next);
});


router.get('/user', utils.isLoggedIn, async (req,res)=>{
  await User.findOne({ email: req.session.passport.user }).
    populate('assignments').
    populate('reports').
    populate('submittedAssignments').populate('createdCourses').
    populate('enrolledCourses').
    exec(async (error, user) => {
    if (error) {
      res.status(401).send('NO USER FOUND!')
    } else if (user) {
      await User.populate(user, { path: 'submittedAssignments', populate: 'reportID' }, (error, popFound) => {
        if (error) { return res.status(500).send('Internal Server Error!') }
        return res.status(200).send(popFound);
      })
    }
  })
})

router.get('/logout', (req, res)=>{
  console.log(req.session)
  req.logout();
  res.send()
})
router.get('/gettas', utils.isLoggedIn, (req, res) => {
  User.find({
    $and: [
      { institution: req.user.institution },
      { accType: 'Teacher Assistant' },
      { active: true }
    ]
  }).exec((error, TAs) => {
    if (error) {
      res.status(500).send('Internal Server Error!')
    } else if (TAs.length !== 0) {
      res.status(200).send(TAs)
    } else if (TAs.length == 0) {
      res.status(404).send('No Teacher Assistants Available')
    }
  })
 })

router.get('/getinactiveusers', utils.isLoggedIn, (req, res) => {
  User.find({ active: false, $or: [{accType: 'Module Coordinator'}, {accType: 'Teacher Assistant'}] } ).exec((error, users) => {
    if (error) { return res.status(500).send("Internal Server Error!") }
    return res.status(200).send(users);
  })
})
router.get('/activate/:uid', utils.isLoggedIn, (req, res) => {
  User.updateOne({ _id: req.params.uid }, { active: true }, (error, user) => {
    if (error) { return res.status(500).send("Internal Server Error!") }
    else if (!user || user.length == 0) { return res.status(400).send("User not found!") }
    return res.status(200).send('done');
  })
})
router.delete('/delete/:uid', utils.isLoggedIn, (req, res) => {
  User.findOne({ _id: req.params.uid } , (error, use) => {
    if (error) { return res.status(500).send('Internal Server Error!') }
    use.remove()
    return res.status(200).send("deleted")
  })
})

module.exports = router;