const express = require("express");

const isAuthenticated = require("../middleware/isAuthenticated");
const isOwner = require("../middleware/isOwner");
const isOwnerOrContributor = require("../middleware/isOwnerOrContributor");
const ShoppingList = require("../model/ShoppingList");

const router = express.Router();

// get all lists by certain user
router.get("/", isAuthenticated, (req, res) => {
  ShoppingList.find({ owner: req.user.foundUser._id }, (err, lists) => {
    if (err) return res.status(400).json({ status: "error", errors: [err] });
    if (lists.length < 1) {
      return res.status(200).json({
        status: "empty",
        errors: [],
        data: "no shopping lists for given user",
      });
    } else {
      return res
        .status(200)
        .json({ status: "success", errors: [], data: req.body });
    }
  });
});

// create shopping list
router.post("/", isAuthenticated, (req, res) => {
  const body = req.body;
  const _shoppingList = new ShoppingList({
    name: body.name,
    items: body.items,
    owner: req.user.foundUser._id,
    contributors: body.contributors || [],
  });
  _shoppingList.save((err, result) => {
    if (err) {
      return res.status(400).json({ status: "error", errors: [err] });
    } else {
      res.status(201).json({ status: "created", data: req.body, errors: [] });
    }
  });
});

// get list by id
router.get("/:listId", isAuthenticated, isOwnerOrContributor, (req, res) => {
  const listId = req.params.listId;
  ShoppingList.findById(
    listId,

    (err, list) => {
      if (err) {
        return res.status(400).json(new ErrorResponse("error", [err]));
      }
      if (!list) {
        return res
          .status(404)
          .json(new ErrorResponse("error", ["no list found for given id"]));
      } else {
        return res
          .status(200)
          .json({ status: "success", data: req.body, errors: [] });
      }
    }
  );
});

// update shopping list
router.put("/:listId", isAuthenticated, isOwner, (req, res) => {
  if (!req.body.name)
    return res
      .status(400)
      .json(new ErrorResponse("error", ["new name not filled"]));
  ShoppingList.findByIdAndUpdate(
    req.params.listId,
    req.body,
    { new: true, rawResult: true, runValidators: true },
    (err) => {
      if (err) {
        return res.status(400).json(new ErrorResponse("error", [err]));
      } else {
        return res.status(200).json({
          status: "updated",
          data: { listId: req.params.listId, body: req.body },
          errors: [],
        });
      }
    }
  );
});

// delete shopping list
router.delete("/:listId", isAuthenticated, isOwner, (req, res) => {
  ShoppingList.findByIdAndDelete(req.params.listId, (err) => {
    if (err) {
      return res.status(400).json(new ErrorResponse("error", [err]));
    } else {
      return res
        .status(200)
        .json({ status: "deleted", errors: [], data: req.params.listId });
    }
  });
});

// add item to shopping list
router.post(
  "/:listId/item",
  isAuthenticated,
  isOwnerOrContributor,
  (req, res) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $push: { items: req.body },
      },
      { new: true, rawResult: true, runValidators: true },
      (err) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { listId: req.params.listId, body: req.body },
            errors: [],
          });
        }
      }
    );
  }
);

// rename item in shopping list
router.put(
  "/:listId/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req, res) => {
    console.log(req.body);

    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $set: {
          items: { _id: req.params.itemid, name: req.body.name },
        },
      },
      { new: true, rawResult: true, runValidators: true },
      (err) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "updated",
            data: { paramas: req.params, body: req.body },
            errors: [],
          });
        }
      }
    );
  }
);

// delete item from shopping list
router.delete(
  "/:listId/item/:itemid",
  isAuthenticated,
  isOwnerOrContributor,
  (req, res) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,

      {
        $pull: { items: { _id: req.params.itemid } },
      },
      { new: true, rawResult: true, runValidators: true, upsert: true },
      (err) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(200).json({
            status: "deleted",
            data: { params: req.params },
            errors: [],
          });
        }
      }
    );
  }
);

// add contributor
router.post("/:listId/contributor", isAuthenticated, isOwner, (req, res) => {
  ShoppingList.findByIdAndUpdate(
    req.params.listId,
    {
      $push: { contributors: req.body },
    },
    { new: true, rawResult: true, runValidators: true },
    (err) => {
      if (err) {
        return res.status(400).json(new ErrorResponse("error", [err]));
      } else {
        return res.status(204).json({
          status: "updated",
          errors: [],
          data: { params: req.params, body: req.body },
        });
      }
    }
  );
});

// delete contributor
router.delete(
  "/:listId/contributor/:contributorid",
  isAuthenticated,
  isOwner,
  (req, res) => {
    ShoppingList.findByIdAndUpdate(
      req.params.listId,
      {
        $pull: { contributors: { _id: req.params.contributorid } },
      },
      (err) => {
        if (err) {
          return res.status(400).json(new ErrorResponse("error", [err]));
        } else {
          return res.status(204).json({
            status: "updated",
            errors: [],
            data: { params: req.params },
          });
        }
      }
    );
  }
);
module.exports = router;
