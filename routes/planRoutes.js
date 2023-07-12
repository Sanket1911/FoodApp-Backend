const express = require("express");
const planRouter = express.Router();

const {getAllPlansController,createPlanController,updatePlanController,deletePlanController,getPlansController } = require("../controller/planController");

// planRouter.get("/plans",getAllPlansController);
// planRouter.post("/plans",createPlanController);

// instead of above two lines we can do chaining
planRouter.route("/")
.get(getAllPlansController)
.post(createPlanController)

planRouter.route("/:planRoutes")
    .patch(updatePlanController)
    .delete(deletePlanController)
    .get(getPlansController)

module.exports = planRouter;