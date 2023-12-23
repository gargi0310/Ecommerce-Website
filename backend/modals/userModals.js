const mongoose = require("mongoose");
const validator = require("validator");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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

userSchema.pre("save", async function(next){

    if(!this.isModified("password")){
        next();
    }
    this.password = await bcryptjs.hash(this.password, 10);
});

//JWT TOKEN
userSchema.methods.getJWTToken = function(){
    return jwt.sign({id:this._id}, process.env.JWT_SECRET, {
        expiresIn:process.env.JWT_EXPIRE,
    });
};


//COMPARE PASSWORD

userSchema.methods.comparePassword = async function(enterdPassword){
    return await bcryptjs.compare(enterdPassword, this.password);
};

//GENERATING PASSWORD RESET TOKEN
userSchema.methods.getResetPasswordToken = function (){
    //generating token

    const resetToken = crypto.randomBytes(20).toString("hex");


    //Hashing and add to uesrSchema
    this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken).digest("hex");

    this.resetPasswordExpire = Date.now()+15 * 60*1000;

    return resetToken;
}

module.exports = mongoose.model("User", userSchema);