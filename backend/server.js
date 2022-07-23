const express = require("express");
const mongoogse = require("mongoose");
const workoutRoutes = require("./routes/workouts");
const userRoutes = require("./routes/user");
require("dotenv").config();

// Express app
const app = express();

// middleware for logging path and method

app.use(express.json()); //access json body
app.use((req, res, next) => {
  console.log("NEW REQUEST: ", req.path, req.method);
  next();
});

// Routes
app.use("/api/workouts", workoutRoutes);
app.use("/api/user", userRoutes);

//CONNECT to db
mongoogse
  .connect(process.env.MONGO_URI)
  .then(() => {
    //LISTEN for request only when db is connected
    app.listen(process.env.PORT, () => {
      console.log("Connected to DB \nListening on port", process.env.PORT);
    });
  })
  .catch((error) => {
    console.log(error);
  });
