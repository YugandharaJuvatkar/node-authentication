const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
app.use(express.json());

//Importing route
const authRoute = require("./routes/auth");
const postRoute = require("./routes/posts");
//Connected to DB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(console.log("Connected to DB"))
  .catch((e) => {
    console.log(e);
  });

app.use("/api/v1/user", authRoute);
app.use("/api/v1/post", postRoute);

app.listen(5000, () => {
  console.log("Listening on post 5000");
});
