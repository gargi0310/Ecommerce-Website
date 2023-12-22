const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter your name"],
        maxLength:[30, "Cannot exceed 30 characters"],
        minLength:[4, "Name should have more than 5 letters"]
    },

    email:{
        type:String,
        unique:true,
        validator:[validator.isEmail, "Please enter valid email"]
    },
    password:{
        type:String,
        required:[true, "Please enter your password"],
        minLength:[8, "Password should atleast contain 8 characters"],
        select:false
    },
    avatar:{
        public_id:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
 
 
        type:String,
        default:"user"
    },

    resetPasswordToken:String,
    resetPasswordExpire:Date,
});

module.exports = mongoose.model("User", userSchema);