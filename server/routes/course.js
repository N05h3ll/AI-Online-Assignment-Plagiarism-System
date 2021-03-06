const express = require('express');
const router = express.Router()
const utils = require('../utils')
const User = require('../models/user')
const Course = require('../models/course');
const { errorMonitor } = require('nodemailer/lib/mailer');
const course = require('../models/course');

router.post('/addcourse', utils.isLoggedIn, async (req, res) => {
	if (req.body.courseCode) {
		await Course.findOne({ courseInstitution: req.body.courseInstitution, courseCode: req.body.courseCode }).exec((error, course) => {
			if (error) {
				res.status(500).send('Internal Server Error!')
			} else if (course) {
				res.status(500).send("This custom id already in use, please try another one.")
			} else if (!course) {
				const newCourse = new Course(req.body)
				newCourse.save((error, saved) => {
					if (error) {
						res.status(500).status('Error while creating course.')
					} else if (saved) {
						User.findByIdAndUpdate(req.user._id, { $push: { createdCourses: saved._id } }, (error, pushed) => {
							if (error) {
								return res.status(500).send("Internal Server Error!")
							}
							for (TA of saved.TAs) {
								User.findByIdAndUpdate(TA, { $push: { enrolledCourses: saved._id } }, (error, pushed) => {
							if (error) {
								return res.status(500).send("Internal Server Error!")
							}
						})
							}
							return res.status(201).send('Created new course.')
						})
					}
				})
			}
		})
	} else {
				const newCourse = new Course(req.body)
				newCourse.save((error, saved) => {
					if (error) {
						return res.status(500).status('Error while creating course.')
					}
					Course.findByIdAndUpdate(saved._id, {courseCode: saved._id},(error, updated) => {
							if (error) {
								return res.status(500).status('Error while creating course.')
							}
						User.findByIdAndUpdate(req.user._id, { $push: { createdCourses: saved._id } }, (error, pushed) => {
							if (error) {
								return res.status(500).send("Internal Server Error!")
							}
							for (TA of saved.TAs) {
								User.findByIdAndUpdate(TA, { $push: { enrolledCourses: saved._id } }, (error, pushed) => {
							if (error) {
								return res.status(500).send("Internal Server Error!")
							}
						})
							}
							return res.status(201).send('Created new course.')
						})
						})
					
				})
	}
})
router.get('/getcourse/:cID', utils.isLoggedIn, (req, res) => {
	console.log(req.params.cID);
	Course.findById(req.params.cID).populate('creator').
		populate('TAs').
		populate('enrolledStudents').
		populate('assignments').
		exec((error, found) => {
		if (error) {
			return res.status(404).send('Course not found!')
		}
		return res.status(200).send(found)
	})
})

router.post('/search', utils.isLoggedIn, (req, res) => {
	Course.find({
		$and: [{
			$or: [{ courseName: { $regex: '.*' + req.body.query + '.*' } }, { courseCode: { $regex: '.*' + req.body.query + '.*' } }]
		}, {
			courseInstitution: req.body.institution
			}, {
			_id: {$nin: req.user.enrolledCourses}
		}]
	}).populate('creator')
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

router.post('/enroll/:courseID', utils.isLoggedIn, (req, res) => {
	User.findByIdAndUpdate(req.user._id, { $push: { enrolledCourses: req.params.courseID } }, (error, user) => {
		if (error) { return res.status(500).send('Internal Server Error') }
		Course.findByIdAndUpdate(req.params.courseID, { $push: { enrolledStudents: req.user._id } }, (error, updatedCourse) => {
			if (error) { return res.status(500).send('Internal Server Error') }
			return res.status(201).send('Enrolled Successfully');
		})
	})
})
router.delete('/delete/:cid', utils.isLoggedIn, (req, res) => {
  Course.findOne({ _id: req.params.cid } , (error, crs) => {
    if (error) { return res.status(500).send('Internal Server Error!') }
    crs.remove()
    return res.status(200).send("deleted")
  })
})
module.exports = router