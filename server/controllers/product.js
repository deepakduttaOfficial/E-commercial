const Product = require("../models/product");
const formidable = require("formidable");
const fs = require("fs");

// MiddleWare ----????????????
exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err || !product) {
        return res.status(400).json({
          error: "Product not found",
        });
      }
      req.product = product;
      next();
    });
};

//Create Product----->
exports.createProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "SOMETHING WORNG",
      });
    }

    const { name, price, stock, category, description } = fields;
    if (!name || !price || !stock || !category || !description) {
      return res.status(400).json({
        error: "PLZ Include all fildes",
      });
    }

    const product = new Product(fields);

    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size to BIG",
        });
      }
      product.photo.data = fs.readFileSync(files.photo.filepath);
      product.photo.ContentType = files.photo.mimetype;
    }

    product.save((err, product) => {
      if (err || !product) {
        return res.status(500).json({
          error: "Create Product Fail",
        });
      }
      product.photo = undefined;
      return res.status(200).json(product);
    });
  });
};

//Read Product----->
exports.getAllProducts = (req, res) => {
  Product.find()
    .populate("category")
    .select("-photo")
    .exec((err, products) => {
      if (err || !products) {
        return res.status(400).json({
          error: "Products not found",
        });
      }
      return res.status(200).json(products);
    });
};
exports.getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};
exports.getphoto = (req, res, next) => {
  if (req.product.photo.data) {
    res.set("ContentType-Type", req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

//Update Product----->
exports.updateProduct = (req, res) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: "SOMETHING WORNG",
      });
    }
    if (files.photo) {
      if (files.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size to BIG",
        });
      }
    }
    const { name, price, stock, category, description } = fields;
    if (files.photo) {
      Product.findByIdAndUpdate(
        { _id: req.product._id },
        {
          $set: {
            name,
            price,
            stock,
            category,
            description,
            photo: {
              data: fs.readFileSync(files.photo.filepath),
              ContentType: files.photo.mimetype,
            },
          },
        },
        (err, product) => {
          if (err || !product) {
            return res.status(400).json({
              error: err,
            });
          }
          product.photo = undefined;
          return res.json(product);
        }
      );
    } else {
      Product.findByIdAndUpdate(
        { _id: req.product._id },
        { $set: { name, price, stock, category, description } },
        (err, product) => {
          if (err || !product) {
            return res.status(400).json({
              error: err,
            });
          }
          product.photo = undefined;
          return res.json(product);
        }
      );
    }
  });
};

//Delete Product------------>
exports.deleteProduct = (req, res) => {
  const product = req.product;
  product.remove((err, product) => {
    if (err || !product) {
      return res.status(400).json({
        error: "Delete Product Fail",
      });
    }
    return res.status(200).json(`${product.name} product was delete`);
  });
};

//Update stock and sold

exports.updateStock = (req, res, next) => {
  let myOperations = req.body.order.products.map((product) => {
    return {
      updateOne: {
        filter: { _id: product._id },
        update: { $inc: { stock: -1, sold: +1 } },
      },
    };
  });
  Product.bulkWrite(myOperations, {}, (err, products) => {
    if (err) {
      return res.status(400).json({
        error: err,
      });
    }
    next();
  });
};
