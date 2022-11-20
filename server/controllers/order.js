const { Order } = require("../models/order");

exports.createOrder = (req, res) => {
  req.body.order.user = req.profile;
  const order = new Order(req.body.order);
  order.save((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Fail to save order in DB",
      });
    }
    return product;
  });
};
exports.getAllOrders = (req, res) => {
  Order.find({}, (err, order) => {
    if ((err, !order)) {
      return res.status(400).json("Find categories fail");
    }
    return res.json(order);
  });
};
