const express = require("express");
const cors = require("cors");
require("./DB/config");
const User = require("./DB/User");
const app = express();

app.use(express.json());
app.use(cors());

//API for user singup
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject();           //For removing password from API
  delete result.password;
  res.send(result);
});

//API for user login
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password");    //For removing password from API
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "NO USER FOUND" });
    }
  } else {
    res.send({ result: "NO USER FOUND" });
  }
});

app.listen(5000);

// app.get("/", (req, res) => {            //helps in creating API
//     res.send("App is working");
// });
