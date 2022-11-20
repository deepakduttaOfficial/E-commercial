const express = require("express");
const { body } = require("express-validator");
const { isSignedIn, isAuthenticate, isAdmin } = require("../controllers/auth");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/category");
const { getUserById } = require("../controllers/user");

// MiddleWare ----????????????
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

//Create Category----->
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  [body("name", "Category name atleast 3 Charecter").isLength({ min: 3 })],
  createCategory
);

//Read Category----->
router.get("/categories", getAllCategories);
router.get("/category/:categoryId", getCategory);

//Update Category----->
router.put(
  "/category/update/:userId/:categoryId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  [body("name", "Category name atleast 3 Charecter").isLength({ min: 3 })],
  updateCategory
);

//Delete Category------------>
router.delete(
  "/category/delete/:userId/:categoryId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteCategory
);

module.exports = router;
