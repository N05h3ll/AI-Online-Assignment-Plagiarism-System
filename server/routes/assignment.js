const express = require('express');
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const Report = require('../models/report')
const Assignment = require('../models/assignment');
const { NativeError } = require('mongoose');



router.post('/addassignment', utils.isLoggedIn, (req, res) => {
	if (req.body.code) {
	Assignment.findOne({ code: req.body.code, authorInstitution: req.body.authorInstitution }, (err, ass) => {
		if (err) {
			res.status(500).send("Internal Server Error!")
		} else if (ass) {
			res.status(422).send("Assignment ID Already Exists!")
		} else if (!ass) {
			assignment = new Assignment(req.body)
			assignment.save((error, newAssignment) => {
				if (error) {
					res.status(500).send("Internal Server Error!");
				} else if (newAssignment) {
					User.findByIdAndUpdate(req.body.authorID, { $push: { assignments: newAssignment._id } }, (error) => {
						if (error) {
							res.status(500).send("Internal Server Error!")
						} else {
							res.status(201).send("Assignment Created Successfully")
						}
					})
				}
			})
		}
	})
	} else {
		assignment = new Assignment(req.body);
		assignment.save((error, newAssignment) => {
			if (error) {
				res.status(500).send("Internal Server Error!")
			} else if (newAssignment) {
				Assignment.findByIdAndUpdate(newAssignment._id, { code: newAssignment._id }, (error) => {
					if (error) {
						res.status(500).send("Ineternal Server Error!")
					} else {
						User.findByIdAndUpdate(req.body.authorID, { $push: { assignments: newAssignment._id } }, (error) => {
						if (error) {
							res.status(500).send("Internal Server Error!")
						} else {
							res.status(201).send("Assignment Created Successfully")
						}
					})
					}
				})
			}
		})
}
})

router.get('/getallassignments', utils.isLoggedIn, async (req, res) => {
  console.log(req.session.passport.user)
  await User.findOne({ email: req.session.passport.user }, async (err, user) => {
    if (err) {
      res.status(500).send("internal server error! " + error);
    } else if (user) {
      await Assignment.find({ _id: { $in: user.assignments } }, (error, assignments) => {
        if (error) {
          res.status(500).send("internal server error! " + error);
        } else if (assignments) {
          res.send(assignments)
        }
      })
      
    }
  })
})


router.post('/search', utils.isLoggedIn, (req, res) => {
	Assignment.find({
		$and: [{
			$or: [{ name: { $regex: '.*' + req.body.query + '.*' } }, { code: { $regex: '.*' + req.body.query + '.*' } }]
		}, {
			authorInstitution: req.body.institution
		}]
	})
		.exec(function (err, assignments) {
			if (err) {
				res.status(500).send("Internal Server Error!");
			}else if (assignments.length == 0) {
				res.status(404).send("No Results Found");
			} else if (assignments.length !== 0) {
				res.status(200).send(assignments);
			}
		});
})

router.get('/getassignment/:assid', utils.isLoggedIn, async (req, res) => {
  await Assignment.findById(req.params.assid, (error, assignment) => {
		if (error) {
			console.log(error)
      // res.status(500).send('Internal Server Error !')
    } else if (assignment) {
      res.status(200).send(assignment)
    }
  })
})

module.exports = router