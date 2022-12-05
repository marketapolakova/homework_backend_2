const ShoppingList = require("../model/ShoppingList");

const isOwner = (req, res, next) => {
  const userId = req.user.foundUser._id;

  ShoppingList.findById(req.params.listid, (err, list) => {
    if (err) return res.status(400).json({ status: "error", errors: [err] });
    if (!list)
      return res.status(404).json({
        status: "error",
        errors: ["no shopping lists for given user"],
      });

    if (list.owner.toString() === userId) {
      next();
    } else {
      res.status(401).json({ status: "error", errors: ["unauthorized"] });
    }
  });
};

module.exports = isOwner;
