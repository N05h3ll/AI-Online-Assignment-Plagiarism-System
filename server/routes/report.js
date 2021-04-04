const express = require('express');
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const Report = require('../models/report')
const Assignment = require('../models/assignment')
let nodemailer = require('nodemailer');
let transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.OAPSEMAIL,
    pass: process.env.OAPSPASSWORD
  }
});
router.get('/getallreports', utils.isLoggedIn, async (req, res) => {
  console.log(req.session.passport.user)
  await User.findOne({ email: req.session.passport.user }, async (err, user) => {
    if (err) {
      res.status(500).send("internal server error! " + error);
    } else if (user) {
      await Report.find({ _id: { $in: user.reports } }, (error, reports) => {
        if (error) {
          res.status(500).send("internal server error! " + error);
        } else if (reports) {
          res.send(reports)
        }
      })
      
    }
  })
})
router.get('/getreport/:repid', utils.isLoggedIn, async (req, res) => {
  await Report.findById(req.params.repid, (error, report) => {
    if (error) {
      res.status(500).send('Internal Server Error !')
    } else if (report) {
      res.status(200).send(report)
    }
  })
})
router.get('/emailreport/:repid', utils.isLoggedIn, async (req, res) => {
  await Report.findById(req.params.repid, (error, report) => {
    if (error) {
      res.status(500).send('Intrenal Server Error !');
    } else {
      let mailOptions = {
              from: 'no.reply.oaps@gmail.com',
              to: req.session.passport.user,
              subject: 'OAPS Report Summary.',
              html: `<h1>OAPS REPORT</h1></br>
      <h3>Plagiarism Percentage: ${report.totalPercentage.toString()}%</h3></br>
      <b>Author: </b> ${report.author} </br>
      <b>Upload Date: </b> ${report.uploadDate} </br>
      <b>File Name: </b> ${report.fileName} </br>
      ${(report.isSecondTrial) ? '<b>Second Trial</b>' : ''} </br> </br>
      <p>
      ${function repeatsentences() {
            let sentList = ``
            report.baseParagraph.forEach(element => {
              if (element.active) {
                sentList = sentList+ `<span style="background-color:#FFF000">${element.baseSentence}</span>`+' '
              } else {
                sentList = sentList+`<span>${element.baseSentence}</span>`+' '
              }
            });
                return sentList
              }()}
      </p>`
            };
            console.log(mailOptions)
      transporter.sendMail(mailOptions, function(error, info){
              if (error) {
                console.log(error);
              } else {
                console.log('Email sent: ' + info.response);
              }
            });
    }
  })
})
router.post('/addreport', (req,res)=>{
  console.log(req.body)
  rep = new Report(req.body);

  rep.save((err, report) => {
    if (err) {console.log(err)}
    // console.log(report)
    // console.log(report)
    User.findOneAndUpdate({email: req.body.email},
      {
        $push: {
          reports: report._id,
          submittedAssignments: {
            assignmentID: req.body.assignmentID,
            assignmentName: req.body.assignmentName,
            assignmentCode: req.body.assignmentCode,
            courseID: report.courseID,
            submissionDate: report.uploadDate,
            status: report.status
          }
        }
      }, (err, user) => {
        if (err) { console.log(err) }
        Assignment.findByIdAndUpdate(report.assignmentID, {
          $push: {
            submittedStudents: {
              studentdID: user._id,
              studentdName: user.name,
              submissionDate: report.uploadDate,
              status: report.status,
              reportID: report._id
            }
          }
        }, (err) => {
            if(err){console.log(err)}
          res.send('done')
        })
    })
  });

})

module.exports = router