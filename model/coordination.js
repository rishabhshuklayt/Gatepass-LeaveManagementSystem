const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const coordinatorSchema = new mongoose.Schema({
    fname: String,
    lname: String,
    email: { 
        type: String, 
        unique: true // Set email as unique
    },
    empid: { 
        type: String, 
        unique: true // Set rollno as unique
    },
    password:{
        type: Array
    } ,
    gender: String
});



coordinatorSchema.plugin(passportLocalMongoose); 
const coordinatorReg = mongoose.model('coordinatorReg', coordinatorSchema);


module.exports = coordinatorReg;

