const express = require("express");
const router = express.Router();
const { signup, signin } = require("../controllers/auth");
const { body } = require("express-validator");
const User = require("../models/user");

router.post(
  "/signup",
  [
    body("name", "Name must be required").isLength({ min: 1 }),
    body("email", "Email required").isLength({ min: 1 }),
    body("email", "invalid Email").isEmail(),
    body("email").custom((value) => {
      return User.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    }),
    body("password", "Password atleast 3 Char").isLength({ min: 3 }),
  ],
  signup
);

router.post(
  "/signin",
  [
    body("email", "email must be required").isLength({ min: 1 }),
    body("email", "invalid Email").isEmail(),
    body("password", "Password must be required").isLength({ min: 1 }),
  ],
  signin
);

router.get("/signout", (req, res) => {
  res.clearCookie("token");
  return res.status(200).json({
    massage: "User signout successfully",
  });
});

module.exports = router;
