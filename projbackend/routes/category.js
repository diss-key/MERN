const express = require("express")
const router = express.Router();

const {getCategoryById, createCategory, getCategory, getAllCategory, updateCategory, removeCategory} = require("../controllers/category")
const {isAuthenticated, isAdmin, isSignedIn} = require("../controllers/auth")
const {getUserById} = require("../controllers/user");
const { route } = require("./auth");

//params
router.param("userID", getUserById);
router.param("categoryID", getCategoryById);

//actual routes
//create route
router.post("/category/create/:userID", isSignedIn, isAuthenticated, isAdmin, createCategory);
//get route
router.get("/category/:categoryID", getCategory)
router.get("/categories", getAllCategory)
//update
router.put("/category/:categoryID/:userID", isSignedIn, isAuthenticated, isAdmin,  updateCategory)
//Delete
router.delete("/category/:categoryID/:userID", isSignedIn, isAuthenticated, isAdmin,  removeCategory)
module.exports = router;