const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
// const FoodUserModel = require("./model/userModel");
// const jwt = require("jsonwebtoken")
// const secrets = require("./secrets");

const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const planRouter = require("./routes/planRoutes");

app.use(express.json());
app.use(cookieParser());

// now /api/v1/auth is represented by authRouter so use authRouter instead of app to make request
app.use("/api/v1/auth",authRouter); 
app.use("/api/v1/user",userRouter);
app.use("/api/v1/plan",planRouter);

app.listen(3000, function () {
    console.log("server started at port 3000");
});

/**To refer commented code go to eat-fit clone folder */











