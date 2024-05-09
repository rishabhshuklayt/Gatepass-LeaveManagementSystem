const mongoose = require("mongoose")

const requestSchema = new mongoose.Schema({
    fname:String,
    rollno:Number,
    leaveType:String,
    startDate:Date,
    endDate:Date,
    reason:String,
    halfDay:String,
    status: String
})



const Request = mongoose.model('Request', requestSchema );


module.exports = Request