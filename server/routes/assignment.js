const express = require('express');
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const Report = require('../models/report')
const Assignment = require('../models/assignment');
const Course = require('../models/course')
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
							Course.findByIdAndUpdate(newAssignment.courseID, { $push: { assignments: newAssignment._id } }, (error) => {
								if(error) {return res.status(500).send("Internal Server Error!")}
								return res.status(201).send("Assignment Created Successfully")
								
							})
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
							Course.findByIdAndUpdate(newAssignment.courseID, { $push: { assignments: newAssignment._id } }, (error) => {
								if(error) {return res.status(500).send("Internal Server Error!")}
								return res.status(201).send("Assignment Created Successfully")
								
							})
						}
					})
					}
				})
			}
		})
}
})

router.get('/getallassignments', utils.isLoggedIn, async (req, res) => {
  await User.findOne({ email: req.session.passport.user }, async (err, user) => {
    if (err) {
      res.status(500).send("internal server error! " + error);
		} else if (user) {
			if (user.accType == 'Student') {
				res.send(user.submittedAssignments)
			} else if (user.accType == 'Module Coordinator') {
				await Assignment.find({ _id: { $in: user.assignments } }, (error, assignments) => {
				  if (error) {
				    res.status(500).send("internal server error! " + error);
				  } else if (assignments) {
						res.send(assignments)
				  }
				})
			}
    }
  })
})


router.post('/search', utils.isLoggedIn, (req, res) => {
	Assignment.find({
		$and: [{
			$or: [{ name: { $regex: '.*' + req.body.query + '.*' } }, { code: { $regex: '.*' + req.body.query + '.*' } }]
		}, {
			authorInstitution: req.body.institution
			}, {
				courseID: {$in: req.user.enrolledCourses}
			}, {
				_id: {$nin: req.user.submittedAssignments.map(x => x.assignmentID)}
			}]
	}).populate('courseID')
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
  Assignment.findById(req.params.assid, (error, assignment) => {
		if (error) {
      res.status(500).send('Internal Server Error !')
		} else if (assignment) {
      res.status(200).send(assignment)
    }
  })
})
router.get('/:assid/getsubmittedstudents', utils.isLoggedIn, (req, res) => {
	Assignment.findById(req.params.assid, (error, students) => {
		if (error) {
			res.status(500).send('Internal Server Error!')
		} else if (students.submittedStudents.length == 0) {
			res.status(404).send("No Submissions Yet ...");
		} else if (students.submittedStudents.length !== 0) {

			res.status(200).send(students.submittedStudents)
		}
	})
})
router.get('/:assid/issubmitted', utils.isLoggedIn, (req, res) => {
	// console.log(req.params.assid)
	Assignment.findOne({
		$and: [
			{ _id: req.params.assid },
			{ 'submittedStudents.studentdID': req.user._id },
			{ 'submittedStudents.status': { $ne: 'Second Trial' } }
		]
	}, (error, assignment) => {
		if (error) {
			return res.status(500).send("Internal Server Error")
		} else if (!assignment) {return  res.status(403).send() }
			return res.status(200).send();
		}
	)
})
router.get('/:assID/allow/:stuID/rep/:repID', utils.isLoggedIn, (req, res) => {
	console.log(req.params.assID)
	console.log(req.params.stuID)
	console.log(req.params.repID)
	Assignment.findOneAndUpdate({ _id: req.params.assID, 'submittedStudents.studentdID': req.params.stuID }
		, {
			$set: {
			"submittedStudents.$.status": 'Second Trial'
		}}, (error, ass) => {
		if (error) { return res.status(500).send('Internal Server Error') }
		
			Report.findByIdAndUpdate(req.params.repID, { status: 'Second Trial', isSecondTrial: true }, (error) => {
				if (error) { return res.status(500).send('Internal Server Error!') }
				User.findOneAndUpdate({ _id: req.params.stuID, 'submittedAssignments.assignmentID': req.params.assID },
					{
						$set: {
						'submittedAssignments.$.status': 'Second Trial'
					}
					},
					(error, usr) => {
						console.log(usr)
						if (error) { return res.send(500).send('Internal Server Error') }
						return res.status(200).send('allowed');
					}
				)
		})
	})
})
module.exports = router