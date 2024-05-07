const express = require("express");
const router = express.Router();
const Product = require("../models/product");
const Review = require("../models/review");
const { isLoggedIn } = require("../middleware");

//display all products
router.get("/products", isLoggedIn, async (req, res) => {
  try {
    const products = await Product.find({});
    res.render("products/index", { products });
  } catch (e) {
    req.flash("error", "can't find product");
    res.redirect("/error");
  }
});

//Get the from for new product

router.get("/products/new", isLoggedIn, (req, res) => {
  res.render("products/new");
});

//create new product

router.post("/products", isLoggedIn, async (req, res) => {
  try {
    //console.log(req.body.product);
    await Product.create(req.body.product);
    req.flash("success", "Product created successfully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", "can't post the product");
    res.redirect("/error");
  }
});

//show particular product

router.get("/products/:id", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate("reviews");
    // console.log(product);
    res.render("products/show", { product });
  } catch (e) {
    req.flash("error", "can't show product because something wrong");
    res.redirect("/error");
  }
});

//edit form

router.get("/products/:id/edit", isLoggedIn, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.render("products/edit", { product });
  } catch (e) {
    req.flash("error", "can't form for edit product because something wrong");
    res.redirect("/error");
  }
});

//update the particular product

router.patch("/products/:id", isLoggedIn, async (req, res) => {
  try {
    await Product.findByIdAndUpdate(req.params.id, req.body.product);
    req.flash("success", "Updated successfully");
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    req.flash("error", "can't update product because something wrong");
    res.redirect("/error");
  }
});

//delete a particular product

router.delete("/products/:id", isLoggedIn, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    req.flash("success", "deleted successfully");
    res.redirect("/products");
  } catch (e) {
    req.flash("error", "can't delete product because something wrong");
    res.redirect("/error");
  }
});

//coment on the products
router.post("/products/:id/review", isLoggedIn, async (req, res) => {
  // console.log(req.body);
  // res.send("Hit the submit button");
  try {
    const product = await Product.findById(req.params.id);
    const review = new Review({
      user: req.user.username,
      ...req.body,
    });
    // console.log(review);
    product.reviews.push(review);
    await review.save();
    await product.save();
    res.redirect(`/products/${req.params.id}`);
  } catch (e) {
    req.flash("error", "can't show product because something wrong");
    res.redirect("/error");
  }
});

router.get("/error", (req, res) => {
  res.status(500).render("error");
});

module.exports = router;
