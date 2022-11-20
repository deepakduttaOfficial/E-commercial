const User = require("../models/user");

// MiddleWare ----????????????
exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err) {
      return res.status(400).json({
        error: "Invalid User",
      });
    }
    req.profile = user;
    next();
  });
};

// Read Controlller--------->
exports.getUser = (req, res) => {
  req.profile.password = undefined;
  return res.json(req.profile);
};
exports.getAllUser = (req, res) => {
  User.find({}, (err, users) => {
    if (err || !users) {
      return res.status(400).json({
        error: "No user found in DB",
      });
    }
    users.map((user) => {
      user.password = undefined;
    });
    return res.json(users);
  });
};

//Update Controller---------->
exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { name: req.body.name },
    (err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "USER UPDATE FAIL",
        });
      }
      user.password = undefined;
      return res.json(user);
    }
  );
};

//Order update
exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchese = [];
  req.body.order.products.forEach((product) => {
    purchese.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //Save in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchese: purchese } },
    { new: true },
    (err, purchese) => {
      if (err || !purchese) {
        return res.status(400).json({
          error: err,
        });
      }
      next();
    }
  );
};
