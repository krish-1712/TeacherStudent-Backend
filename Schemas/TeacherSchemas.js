const mongoose = require('mongoose')



let TeacherSchemas = new mongoose.Schema(
    {
        name: String,
        age: Number,
        email: String,
        subject: String,
        qualification: String,
        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "Teacher",
        versionKey: false
    }
)

let teacherModel = mongoose.model('Teacher', TeacherSchemas)
module.exports = { teacherModel }