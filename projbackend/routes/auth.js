const { Router } = require("express");

var express = require('express')
var router = express.Router()
const {signout, signin, signup, isSignedIn} = require("../controllers/auth");
const { check, validationResult } = require('express-validator');




//signup comes from controller
//add express-validator check before controller
router.post("/signup", [
    check('name').isLength({ min: 3 }).withMessage('name should be at least 3 characters'),
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 3 }).withMessage('password should be at least 3 characters')
],signup);

router.post("/signin", [
    check('email').isEmail().withMessage('email is required'),
    check('password').isLength({ min: 1 }).withMessage('password filed is required')
],signin);


router.get("/signout", signout);

router.get("/testroute", isSignedIn, (req, res) => {
    res.json(req.auth);
});

module.exports = router;
