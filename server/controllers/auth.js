const User = require("../models/user");
const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
const expressJwt = require("express-jwt");

//SIGNUP CONTROLLER------>
exports.signup = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  const user = new User(req.body);
  user.save((error, user) => {
    if (error || !user) {
      return res.status(500).json({ error: error });
    }
    res.json("Sign up successsfull , Plz login");
  });
};

//SIGNIN CONTROLLER------>
exports.signin = (req, res) => {
  const { email, password } = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }

  User.findOne({ email }, (error, foundUser) => {
    if (error || !foundUser) {
      return res.status(400).json({
        error: "User not register",
      });
    }
    const result = bcrypt.compareSync(password, foundUser.password);
    if (result !== true) {
      return res.status(400).json({
        error: "Email and password could not match",
      });
    }

    const { _id, name, email, role } = foundUser;
    let token = jwt.sign({ _id: _id }, process.env.JWT_SECRET_KEY);
    res.cookie("token", token, { expire: new Date() + 9999 });

    return res.status(200).json({ token, user: { name, email, _id, role } });
  });
};

// MiddleWare -->
exports.isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET_KEY,
  algorithms: ["HS256"],
  requestProperty: "auth",
});

exports.isAuthenticate = (req, res, next) => {
  const checker = req.auth && req.profile && req.auth._id == req.profile._id;
  if (!checker) {
    return res.status(400).json({
      error: "ACCESS DINIED",
    });
  }
  next();
};

exports.isAdmin = (req, res, next) => {
  if (req.profile.role === 0) {
    return res.status(400).json({
      error: "YOU ARE NOT ADMIN",
    });
  }
  next();
};
