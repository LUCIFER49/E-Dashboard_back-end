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
  let result = await product.save();    //save() for saving data in DB
  res.send(result); 
});

//API for getting all the products list from database
app.get('/products', async (req, res) => {
  let products = await Product.find();      //find() for fetching all the product from DB
  if(products.length > 0){
    res.send(products)
  }else {
    res.send({ result:"No Product found" });
  }
});

//API for deleting data 
app.delete('/product/:id', async (req, res) => {
  const result = await Product.deleteOne({_id:req.params.id});    //deleteOne() is used for deleting a single product from DB
  res.send(result);
});

//API for fetching respective product data from DB
app.get('/product/:id', async (req, res) => {
  let result = await Product.findOne({_id:req.params.id});    //findOne() is for fetching single product from DB
  if(result){
    res.send(result);
  }else{
    res.send({result:"NO RECORD FOUND"});
  }
});

//API for updating data in DB
app.put("/product/:id", async (req, res) => {
  let result = await Product.updateOne(         //updateOne() is for updating a single product; 
  { _id: req.params.id, }, { $set: req.body }   // 1st argu for specifying criteria on which data is begin update & 2nd argu for telling what data is being updated
  );
  res.send(result);
});

app.listen(5000);

// app.get("/", (req, res) => {            //helps in creating API
//     res.send("App is working");
// });
