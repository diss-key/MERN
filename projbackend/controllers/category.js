const Category = require("../models/category");
const formidable = require("formidable");
const _ = require("lodash");

exports.getCategoryById = (req, res, next, id) => {
  Category.findById(id).exec((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Category not found in DB",
      });
    }
    req.category = category;
    next();
  });
};

exports.createCategory = (req, res) => {
  const category = new Category(req.body);
  category.save((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Not able to save category in DB",
      });
    }
    res.json({ category });
  });
};

exports.getCategory = (req, res) => {
  return res.json(req.category);
};

exports.getAllCategory = (req, res) => {
  Category.find().exec((err, categories) => {
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }
    res.json(categories);
  });
};

// exports.updateCategory = (req, res) => {
//   const category = req.category;
//   category.name = req.body.name;

//   category.save((err, category) => {
//     if (err) {
//       return res.status(400).json({
//         error: "Failed to update category",
//       });
//     }
//     res.json({ category });
//   });
// };
exports.updateCategory = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields) => {
    if (err) {
      return res.status(400).json({
        error: "problem with name",
      });
    }
    //updation code
    let category = req.category;
    category = _.extend(category, fields);

    //save to the DB
    category.save((err, category) => {
      if (err) {
        res.status(400).json({
          error: "Updation of category failed",
        });
      }
      res.json(category);
    });
  });
};

exports.removeCategory = (req, res) => {
  const category = req.category;
  category.remove((err, category) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete this category",
      });
    }
    res.json({
      message: `Successfully deleted ${category.name}`,
    });
  });
};

