const mongoose = require('mongoose');
const schema = mongoose.Schema;
const assignment = require('./assignment');
const courseSchema = new schema({
  courseName: {type: String},
  createdOn: {type: Date},
  courseCode: {type: String},
	creator: { type: mongoose.Schema.Types.ObjectId, ref: 'user' },
	courseInstitution: { type: String },
	//CHANGE TYPE TO OBJECT ID
	TAs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	courseCapacity: { type: Number },
	enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: 'user' }],
	assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'assignment' }]
		
});

courseSchema.post('remove', (doc) => {
	assignment.deleteMany({ _id: { $in: doc.assignments } }, (error, ass) => {
		return
	})
	mongoose.model('user').findOneAndUpdate({ _id: doc.creator }, { $pull: { createdCourses: doc._id } }, (error, cc) => {
		return
	})
	mongoose.model('user').find({ _id: {$in: doc.enrolledStudents} }, (error, users) => {
		users.forEach((user) => {
			user.enrolledCourses.pop(doc._id);
			user.save();
		})
	})
});
const course = mongoose.model('course', courseSchema);
module.exports = course;