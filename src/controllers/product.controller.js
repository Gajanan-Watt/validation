const express = require("express");
const { body, validationResult } = require("express-validator");

const Product = require("../models/product.model");

const router = express.Router();

router.post(
  "/",
  body("first_name")
    .isLength({ min: 2, max: 20 })
    .withMessage(
      "Name of product has to be at least 2 characters and maximum 20 characters"
    ),
    body("last_name")
    .isLength({ min: 2, max: 20 })
    .withMessage(
      "Name of product has to be at least 2 characters and maximum 20 characters"
    ),
    body("email").custom(async (value) => {
        // value = a@a.com
        const isEmail = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,20}$/.test(value);
        console.log(isEmail);
        if (!isEmail) {
          throw new Error("Please enter a proper email address");
        }
        const productByEmail = await Product.findOne({ email: value })
          .lean()
          .exec();
          //console.log(productByEmail);
        if (productByEmail) {
          throw new Error("Please try with a different email address");
        }
        return true;
      }),
  body("pincode").custom((value) => {
    // value = 1900
    const isNumber = /^[0-9]*$/.test(value); // true or false
    //console.log(isNumber);
    if (!isNumber || value <= 0) {
      throw new Error("Pincode cannot be 0 or negative");
    }
    return true;
  }).isInt(6).withMessage("Entered pincode has to be 6 digit"),
  body("age")
    .isInt({ gt: 1, lt: 100 })
    .withMessage(
      "Name of product has to be at least 2 characters and maximum 20 characters"
    ),
  body("gender").custom((value) => {
    let array = ["Male", "Female", "Others"];
    let count = 0;
    for(let i = 0; i < array.length; i++){
      if(value == array[i]){
        count++;
        
      } 
    }
    if(count > 0){
      return true;
    } else {
      throw new Error("Gender cannot be other than this");
    }

    
    //console.log(value);
  }),
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let newErrors = errors.array().map(({ msg, param, location }) => {
        return {
          [param]: msg,
        };
      });
      return res.status(400).json({ errors: newErrors });
    }
    try {
      const product = await Product.create(req.body);

      return res.status(201).json({ product });
    } catch (e) {
      return res.status(500).json({ status: "failed", message: e.message });
    }
  }
);

module.exports = router;