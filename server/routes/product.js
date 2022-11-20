const express = require("express");
const { isSignedIn, isAuthenticate, isAdmin } = require("../controllers/auth");
const router = express.Router();

const { getCategoryById } = require("../controllers/category");
const { getUserById } = require("../controllers/user");
const {
  getProductById,
  createProduct,
  getAllProducts,
  getProduct,
  getphoto,
  updateProduct,
  deleteProduct,
} = require("../controllers/product");

// MiddleWare ----????????????
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);
router.param("productId", getProductById);

//Create Product----->
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  createProduct
);

//Read Product----->
router.get("/products", getAllProducts);
router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", getphoto);

//Update Product----->
router.put(
  "/product/update/:userId/:productId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  updateProduct
);

//Delete Product------------>
router.delete(
  "/product/delete/:userId/:productId",
  isSignedIn,
  isAuthenticate,
  isAdmin,
  deleteProduct
);

module.exports = router;
