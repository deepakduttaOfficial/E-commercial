const Category = require("../models/category");
const { validationResult } = require("express-validator");

// MiddleWare ------?????????
exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Category not found",
      });
    }
    req.category = category;
    next();
  });
};

//Create Category ---------->
exports.createCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Create category Fail / This Category name already exist",
      });
    }
    return res.json(category);
  });
};

//Read Category ------>
exports.getAllCategories = (req, res) => {
  Category.find({}, (err, categories) => {
    if ((err, !categories)) {
      return res.status(400).json("Find categories fail");
    }
    return res.json(categories);
  });
};
exports.getCategory = (req, res) => {
  return res.json(req.category);
};

//Update Category----->
exports.updateCategory = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      error: errors.array()[0].msg,
    });
  }
  Category.findByIdAndUpdate(
    { _id: req.category._id },
    { name: req.body.name },
    (err, category) => {
      if (err || !category) {
        return res.status(400).json({
          error: "Update category fail",
        });
      }
      return res.json(category);
    }
  );
};

//Delete Category------>
exports.deleteCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err || !category) {
      return res.status(400).json({
        error: "Delete category Fail",
      });
    }
    return res.status(200).json({
      massage: `${category.name} category was Delete`,
    });
  });
};
