const express = require("express");
const { isSignedIn, isAuthenticate } = require("../controllers/auth");
const {
  getUser,
  getUserById,
  updateUser,
  getAllUser,
} = require("../controllers/user");
const router = express.Router();

// MiddleWare ----????????????
router.param("userId", getUserById);

// Read Router--------->
router.get("/user/:userId", isSignedIn, isAuthenticate, getUser);
router.get("/users", getAllUser);

//Update Router---------->
router.put("/user/update/:userId", isSignedIn, isAuthenticate, updateUser);

module.exports = router;
