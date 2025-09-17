const express = require("express");

const {
  createOrder,
  getAllOrdersByUser,
  getOrderDetails,
  capturePayment,
  deleteOrder,
} = require("../../controllers/shop/order-controller");

const { validateOrderData } = require("../../middleware/validation");

const router = express.Router();

router.post("/create", validateOrderData, createOrder);
router.post("/capture", capturePayment);
router.get("/list/:userId", getAllOrdersByUser);
router.get("/details/:id", getOrderDetails);
router.delete("/delete/:id", deleteOrder);

module.exports = router;
