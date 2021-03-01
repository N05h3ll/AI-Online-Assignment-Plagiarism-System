const mongoose = require('mongoose');
const schema = mongoose.Schema;
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

const course = mongoose.model('course', courseSchema);
module.exports = course;