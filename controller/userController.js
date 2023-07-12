const FoodUserModel = require("../model/userModel")

async function getAllUsersController(req,res){
    try{
        let users = await FoodUserModel.find(); // no condition given in find() hence all will come
        res.json(users);
    }catch(err){
        res.send(err.message);
    }
}

async function profileController(req,res){
    try{
        // add userId as key in req-body in protect route
        console.log(req.userId);
        let user = await FoodUserModel.findById(req.userId);
        // res.json(user);
        res.json({
            data : user,
            message : "Data about logged in user is sent"
        })
    }catch(err){
        res.send(err.message);
    }
}

module.exports = {
    getAllUsersController,
    profileController
}