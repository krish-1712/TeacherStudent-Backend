const validator = require('validator')
const mongoose = require('mongoose')


let UserSchema = new mongoose.Schema(
    {
        firstname: {
            type: String,
            required: true
        },
        lastname: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            lowercase: true,
            validate: (value) => {
                return validator.isEmail(value)
            }
        },
        password: {
            type: String,
            required: true
        },
        role: {
            type: String,
            enum: ["student", "teacher"],
            default: "student"
        },
        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "studentlog",
        versionKey: false
    }
)

let userModel = mongoose.model("studentlog", UserSchema)
module.exports = { userModel }