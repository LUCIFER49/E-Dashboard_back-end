const express = require("express");
const cors = require("cors");
require("./DB/config");
const User = require("./DB/User");
const Product = require("./DB/Product");
const JWT = require('jsonwebtoken');

const app = express();
const jwtKey = 'e-comm';

app.use(express.json());
app.use(cors());


//API for user singup (or ROUTES FOR SIGNUP)
app.post("/register", async (req, res) => {
  let user = new User(req.body);
  let userDetails = await user.save();
  userDetails = userDetails.toObject(); //For removing password from API
  delete userDetails.password;
  JWT.sign({ userDetails }, jwtKey, { expiresIn: "2h" }, (error, token) => {
    if(error){
      res.send({ userDetails:"Something Went Wrong, Please try after sometime" })
    }
    res.send({ userDetails, auth: token })
  })
});

//API for user login (or Routes for LOGIN)
app.post("/login", async (req, res) => {
  if (req.body.password && req.body.email) {
    let user = await User.findOne(req.body).select("-password"); //For removing password from API
    if (user) {
      JWT.sign( {user}, jwtKey, {expiresIn: "2h"}, (error, token) => {   //1st arg: data u want send  2nd arg: callback function     optional parameter: expiry time
        if(error){
          res.send({ result: "Something Went Wrong, Please try after sometime" })
        }
        res.send({ user, auth: token })
      })   
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
  let result = await product.save(); //save() for saving data in DB
  res.send(result);
});

//API for getting all the products list from database
app.get("/products", async (req, res) => {
  let products = await Product.find(); //find() for fetching all the product from DB
  if (products.length > 0) {
    res.send(products);
  } else {
    res.send({ result: "No Product found" });
  }
});

//API for deleting data
app.delete("/product/:id", async (req, res) => {
  const result = await Product.deleteOne({ _id: req.params.id }); //deleteOne() is used for deleting a single product from DB
  res.send(result);
});

//API for fetching respective product data from DB
app.get("/product/:id", async (req, res) => {
  let result = await Product.findOne({ _id: req.params.id }); //findOne() is for fetching single product from DB
  if (result) {
    res.send(result);
  } else {
    res.send({ result: "NO RECORD FOUND" });
  }
});

//API for updating data in DB
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(
    //updateOne() is for updating a single product;
    { _id: req.params.id },
    { $set: req.body } // 1st argu for specifying criteria on which data is begin update & 2nd argu for telling what data is being updated
  );
  res.send(result);
});

//API for performing search action
app.get("/search/:key", async (req, res) => {
  let result = await Product.find({
    "$or": [      //in an object whenever we perform search over multiple field we use "$or" symbol
      { name: { $regex: req.params.key } },
      { company: { $regex: req.params.key } },
      { price: { $regex: req.params.key } },
      { category: { $regex: req.params.key } }, 
    ]                                   
  });
  res.send(result);
});

//Function for verifying  TOKEN for respective user => Also known as middleware 
function verifyToken(req, res, next){
  
}

app.listen(5000);

// app.get("/", (req, res) => {            //helps in creating API
//     res.send("App is working");
// });
