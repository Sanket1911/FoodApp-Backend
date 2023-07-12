const mongoose = require('mongoose');


let planSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true,"Name not send"], // second param is Error Message
        maxlength: [40,"Your plan length should not be more than 40 characters "]
    },
    duration:{
        type: Number,
        required: [true,"You need to provide the duration"],
    },
    price:{
        type: Number,
        required: true
    },
    discount:{
        type:Number,
        validate:{
            validator: function(){
                return this.discount < this.price;
            },
            message: "Discount must be less than actual price"
        }
    },
    description:{
        type:String,
        required:[true,"Description should be present"]
    }

    // reviews
});


const FoodPlanModel = mongoose.model('FoodPlanModel',planSchema);
module.exports = FoodPlanModel;