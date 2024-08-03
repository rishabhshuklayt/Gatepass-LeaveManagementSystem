const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const registrationSchema = new mongoose.Schema({
    fname: String,
    username: {
        type: String,
         unique: true 
    },
    lname: String,
    MotherName: String,
    FatherName: String,
    Address: String,
    email: { 
        type: String, 
        unique: true // Set email as unique
    },
    DOB: String,
    rollno: { 
        type: String, 
        unique: true // Set rollno as unique
    },
    password:{
        type: Array
    } ,
    gender: String,
    year: String,
    course: String,
    semester: String,
    branch: String,
    role: {
        type: String,
        enum: ['student', 'coordinator']
    }
});



registrationSchema.plugin(passportLocalMongoose); 
const Registration = mongoose.model('Registration', registrationSchema);


module.exports = Registration;

