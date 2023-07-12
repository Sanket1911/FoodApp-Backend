// Manager : -> 
// user data -> Store (Schema -> set of features and rules a certain entity should follow)
/* 
name
email
phonenumber
pic
address
password
*/

// Tech Developers
// Flow
//  * How to create a db -> watch on youtube
 
//  * connect to my app -> promise based
const mongoose = require('mongoose');
const secrets = require("../secrets");

let dblink = secrets.DB_LINK;

mongoose
.connect(dblink)
.then(function(){
    console.log("connected");
})
.catch(function(err){
    console.log("error : " + err);
})

//  * how to create a schema : only entries written here will be added to you db no one else
let userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name not send"] // second param is Error Message
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    phoneNumber:{
        type: String,
        minLength: 10,
        maxLength:10
    },
    pic:{
        type:String,
        default:"default.jpg" 
    },
    password:{
        type:String,
        required:[true,"Password is misssing"]
    },
    confirmPassword:{
        type:String,
        required:true,
        // custome validator
        validate: {
            validator: function(){
                // return true : value that is valid
                // return false : value that is not valid
                return this.password == this.confirmPassword;
            },
            // error message
            message : "password miss match"
        }
    },
    address:{
        type: String,
    },

    // added for forgetPassword route
    otp: {
        type: String
    },
    otpExpiry: {
        type: Date
    }
});

// model is used to create a collection in mongodb by following a certain set of rules(Schema)
// collection is set of documents which is CRUD without following any rules
const UserModel = mongoose.model('FoodUserModel',userSchema);
module.exports = UserModel;

//  * how to store values in it
// await userModel.create(data); // in server.js

 