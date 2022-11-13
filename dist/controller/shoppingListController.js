"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var isAuthenticated_1 = __importDefault(require("../middleware/isAuthenticated"));
var isOwner_1 = __importDefault(require("../middleware/isOwner"));
var isOwnerOrContributor_1 = __importDefault(require("../middleware/isOwnerOrContributor"));
var ShoppingList_1 = __importDefault(require("../model/ShoppingList"));
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var router = express_1.default.Router();
// get all lists for user
router.get("/", isAuthenticated_1.default, function (req, res) {
    ShoppingList_1.default.find({ owner: req.user.foundUser._id }, function (err, lists) {
        if (err)
            return res.status(400).json({ status: "error", errors: [err] });
        if (lists.length < 1) {
            return res.status(200).json({
                status: "empty",
                errors: [],
                data: "no shopping lists for given user",
            });
        }
        else {
            return res
                .status(200)
                .json({ status: "success", errors: [], data: lists });
        }
    });
});
// get list by id
router.get("/:listid", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    var listId = req.params.listid;
    ShoppingList_1.default.findById(listId, function (err, list) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        if (!list) {
            return res
                .status(404)
                .json(new errorResponse_1.default("error", ["no list found for given id"]));
        }
        else {
            return res
                .status(200)
                .json({ status: "success", data: list, errors: [] });
        }
    });
});
// create shopping list
router.post("/", isAuthenticated_1.default, function (req, res) {
    var body = req.body;
    var _shoppingList = new ShoppingList_1.default({
        name: body.name,
        items: body.items,
        owner: req.user.foundUser._id,
        contributors: body.contributors || [],
    });
    _shoppingList.save(function (err, result) {
        if (err) {
            return res.status(400).json({ status: "error", errors: [err] });
        }
        else {
            res.status(201).json({ status: "created", data: result, errors: [] });
        }
    });
});
// delete shopping list
router.delete("/:listid", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndDelete(req.params.listid, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({ status: "deleted", errors: [] });
        }
    });
});
// update shopping list
router.put("/:listid", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    if (!req.body.name)
        return res
            .status(400)
            .json(new errorResponse_1.default("error", ["new name not filled"]));
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, req.body, { new: true, rawResult: true }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "updated", data: updatedList, errors: [] });
        }
    });
});
// add item to shopping list
router.post("/:listid/item", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $push: { items: req.body },
    }, { new: true, rawResult: true }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "updated", data: updatedList, errors: [] });
        }
    });
});
// rename item in shopping list
router.put("/:listid/item/:itemid", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    console.log(req.body);
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $set: {
            items: { _id: req.params.itemid, name: req.body.name },
        },
    }, { new: true, rawResult: true }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "updated", data: updatedList, errors: [] });
        }
    });
});
// delete item from shopping list
router.delete("/:listid/item/:itemid", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $pull: { items: { _id: req.params.itemid } },
    }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "deleted", data: updatedList, errors: [] });
        }
    });
});
// check item in shopping list
router.get("/:listid/item/:itemid/mark", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $set: { items: { _id: req.params.itemid, checked: true } },
    }, { new: true, rawResult: true }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "updated", data: updatedList, errors: [] });
        }
    });
});
// add contributor
router.post("/:listid/contributor", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $push: { contributors: req.body },
    }, { new: true, rawResult: true }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(204).json({ status: "updated", errors: [] });
        }
    });
});
// delete contributor
router.delete("/:listid/contributor/:contributorid", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listid, {
        $pull: { contributors: { _id: req.params.contributorid } },
    }, function (err, updatedList) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(204).json({ status: "updated", errors: [] });
        }
    });
});
exports.default = router;
