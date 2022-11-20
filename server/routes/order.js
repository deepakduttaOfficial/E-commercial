const express = require("express");
const { getUserById, pushOrderInPurchaseList } = require("../controllers/user");
const router = express.Router();
const { isAuthenticate, isSignedIn } = require("../controllers/auth");
const {
  createOrder,
  getAllOrders,
  getUserDashboard,
} = require("../controllers/order");
const { updateStock } = require("../controllers/product");

//MiddleWare -------??
router.param("userId", getUserById);
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticate,
  pushOrderInPurchaseList,
  updateStock,
  createOrder
);

router.get("/orders", getAllOrders);

module.exports = router;
