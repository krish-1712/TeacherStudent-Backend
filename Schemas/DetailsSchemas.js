const mongoose = require('mongoose')



let DetailsSchemas = new mongoose.Schema(
    {
        name: String,
        age: Number,
        email: String,
        course: String,
        hobbies: String,
        createdAt: {
            type: Date,
            default: Date.now
        }

    },
    {
        collection: "user",
        versionKey: false
    }
)

let detailsModel = mongoose.model('user', DetailsSchemas)
module.exports = { detailsModel }