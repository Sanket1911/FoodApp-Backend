const FoodUserModel = require("../model/userModel");
const jwt = require("jsonwebtoken");
const secrets = process.env || require("../secrets");
const mailSender = require("../utilities/mailSender");
// *********************Controller Functions*********************
async function signupController(req, res) {
    try {
        let data = req.body;
        console.log(data);
        // to create entry in database
        let newUser = await FoodUserModel.create(data);
        console.log(newUser);
        res.status(201).json({
            result : "User signed up"
        });
    }catch(err){
        res.status(400).json({result: err.message});
    }
}

async function loginController(req, res) {
    // res.send(req.body);
    try {
        // let data = req.body;
        let {email,password} = req.body;
        if(email&&password){
            let user = await FoodUserModel.findOne({email: email});
            console.log(user);
            if(user){
                if(user.password == password){
                    // payload, secret key, encrypt-algo(default is set to SHA256)
                    const token = jwt.sign({id : user["_id"],exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24)},secrets.JWTSECRET); // exp is expiry -> here 1 day is the expiry of token

                    // put token in cookies
                    res.cookie("JWT",token);

                    // before sending user obj to front-end delete its password and confirmPassword key from the user object
                    user.password = undefined;
                    user.confirmPassword = undefined;
                    console.log("login : ",user);
                    res.status(200).json({
                        user
                    })
                    // res.send("User Logged In");
                    // console.log(user);
                }else{
                    res.status(400).json({
                        message : "Email or Password does not match"
                    });
                }
            }else{
                res.status(404).json({
                    message:"User not found"
                });
            }
        }else{
            res.status(400).json({
                message:"Enter both email and password"
            });
        }
    }catch(err){
        console.log("Hi");
        res.status(500).json({result: err.message});
    }
}

async function forgetPasswordController(req,res){
    try{
        const {email} = req.body;
        let user = await FoodUserModel.findOne({email});
        if(user){
            let otp = otpGenerator();
            const afterFiveMinutes = Date.now() + 5*60*1000;
            await mailSender(email,otp);
            user.otp = otp;
            user.otpExpiry = afterFiveMinutes;
            user.save();
            res.status(204).json({ // 204 -> status code of updated successfully
                data : user,
                "message" : "OTP sent to your mail"
            });
        }else{
            res.status(404).json({
                result : "User with this email not found"
            })
        }    
    }catch(err){
        res.status(500).json(err.message);
    }
}

async function resetPasswordController(req,res){
    try{
        let {otp,password,confirmPassword,email} = req.body;
        let user = await FoodUserModel.findOne({email:email});
        console.log(user);
        let currentTime = Date.now();
        console.log('hi');
        if(currentTime > user.otpExpiry){
            // key delete -> get the doc obj -> modify that object by removing useless key
            delete user.otp;
            delete user.otpExpiry;
            await user.save();
            res.status(200).json({
                // data : user,
                result: "OTP Expired"
            });
        }else{
            if(user.otp != otp){
                res.status(200).json({message: "Invalid OTP"});
            }else{
                user = await FoodUserModel.findOneAndUpdate({otp:otp},{password:password,confirmPassword:confirmPassword},{
                    runValidators : true,
                    new: true
                });
                delete user.otp;
                delete user.otpExpiry;
                await user.save();
                // console.log(user);
                res.status(201).json({
                    user : user,
                    message: "Password for the user is reset"
                });
            }
        }
    }catch(err){
        res.status(500).json({
            result: err.message
        });
    }
}

// *************************Helper Functions *************************

function otpGenerator(){
    return (Math.floor(100000 + Math.random() * 900000));
}

function protectRoute(req,res,next){
    // console.log(req.cookies);
    // console.log("Protect route encountered");
    
    try{
        const cookies = req.cookies;
        const JWT = cookies.JWT;
        if(JWT){
            // let token = jwt.verify(JWT,"hello");
            let token = jwt.verify(JWT,secrets.JWTSECRET);
            console.log("JWT Decrypted: ",token);
            req.userId = token.id;
    
            // if you are logged in then it will allow next function to run
            next();
        }else{
            res.send("You are not logged in. Kindly Login");
        }
    }catch(err){
        if(err.message == "invalid signature"){
            res.send("Token Invalid! Kindly Login")
        }else{
            res.send(err.message);
        }
    }
    
}

module.exports = {
    signupController,
    loginController,
    forgetPasswordController,
    resetPasswordController,
    protectRoute
}