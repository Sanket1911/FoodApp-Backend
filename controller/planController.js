const FoodPlanModel = require("../model/planModel");

async function getAllPlansController(req,res){
    try{
        let plans = await FoodPlanModel.find();
        res.status(200).json({
            AllPlan : plans
        });
    }catch(err){
        console.log(err);
        res.status(500).json({
            err : err.message
        })
    }
}


async function createPlanController(req,res){
    try{
        let planObjData = req.body;
        // checking if object empty or not
        let isDataPresent = Object.keys(planObjData).length > 0;
        if(isDataPresent){
            let newPlan = await FoodPlanModel.create(planObjData);
            console.log(newPlan);
            res.status(201).json({
                result: "Plan Created",
                plan: newPlan
            });
        }else{
            res.status(404).json({
                message: "Data is incomplete"
            });
        }
    }catch(err){
        res.status(500).json({err:err.message});
    }
}

async function updatePlanController(req,res){
    try{
        console.log(req.body);
        let planUpdateObjData = req.body;
        let id  = req.params.planRoutes;
        const isDataPresent = Object.keys(planUpdateObjData).length > 0;
        if(isDataPresent){
            const plan = await FoodPlanModel.findById(id);
            for(let key in planUpdateObjData){
                plan[key] = planUpdateObjData[key];
            }
            await plan.save();
            res.status(200).json({
                plan: plan
            })
        }else{
            res.status(404).json({
                message: "Nothing to update"
            })
        }
    }catch(err){
        console.log(err);
        res.status(500).json({err:err.message});
    }
}

async function deletePlanController(req,res){
    
}
async function getPlansController(req,res){
    try{
        let id = req.params.planRoutes;
        // res.json({id});
        let plan = await FoodPlanModel.findById(id);
        res.status(200).json({
            result:"Plan Found",
            plan : plan
        })

    }catch(err){
        res.status(500).json({
            err : err.message
        });
    }
}

module.exports = {
    getAllPlansController,
    createPlanController,
    updatePlanController,
    deletePlanController,
    getPlansController
}