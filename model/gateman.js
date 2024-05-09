const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const gatemanSchema = new mongoose.Schema({
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



gatemanSchema.plugin(passportLocalMongoose); 
const gatemanReg = mongoose.model('gatemanReg', gatemanSchema);


module.exports = gatemanReg;

