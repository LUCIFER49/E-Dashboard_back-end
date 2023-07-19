const express = require("express");
const cors = require("cors");
require("./DB/config");
const User = require("./DB/User");
const Product = require("./DB/Product");
const app = express();

app.use(express.json());
app.use(cors());

//API for user singup (or ROUTES FOR SIGNUP)
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let result = await user.save();
  result = result.toObject(); //For removing password from API
  delete result.password;
  res.send(result);
});

//API for user login (or Routes for LOGIN)
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password"); //For removing password from API
    if (user) {
      res.send(user);
    } else {
      res.send({ result: "NO USER FOUND" });
    }
  } else {
    res.send({ result: "NO USER FOUND" });
  }
});

//API for adding products in database (or Routes for ADDING PRODUCTS)
app.post("/add-product", async (req, res) => {
  let product = new Product(req.body);
  let result = await product.save();
  res.send(result);
});

//API for getting all the products list from database
app.get('/products', async (req, res) => {
  let products = await Product.find();
  if(products.length > 0){
    res.send(products)
  }else {
    res.send({ result:"No Product found" });
  }
});

app.listen(5000);

// app.get("/", (req, res) => {            //helps in creating API
//     res.send("App is working");
// });
