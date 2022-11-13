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
                .json({ status: "success", errors: [], data: req.body });
        }
    });
});
// get list by id
router.get("/:listId", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    var listId = req.params.listId;
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
                .json({ status: "success", data: req.body, errors: [] });
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
            res.status(201).json({ status: "created", data: req.body, errors: [] });
        }
    });
});
// delete shopping list
router.delete("/:listId", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndDelete(req.params.listId, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res
                .status(200)
                .json({ status: "deleted", errors: [], data: req.params.listId });
        }
    });
});
// update shopping list
router.put("/:listId", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    if (!req.body.name)
        return res
            .status(400)
            .json(new errorResponse_1.default("error", ["new name not filled"]));
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, req.body, { new: true, rawResult: true, runValidators: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({
                status: "updated",
                data: { listId: req.params.listId, body: req.body },
                errors: [],
            });
        }
    });
});
// add item to shopping list
router.post("/:listId/item", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $push: { items: req.body },
    }, { new: true, rawResult: true, runValidators: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({
                status: "updated",
                data: { listId: req.params.listId, body: req.body },
                errors: [],
            });
        }
    });
});
// rename item in shopping list
router.put("/:listId/item/:itemid", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    console.log(req.body);
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $set: {
            items: { _id: req.params.itemid, name: req.body.name },
        },
    }, { new: true, rawResult: true, runValidators: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({
                status: "updated",
                data: { paramas: req.params, body: req.body },
                errors: [],
            });
        }
    });
});
// delete item from shopping list
router.delete("/:listId/item/:itemid", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $pull: { items: { _id: req.params.itemid } },
    }, { new: true, rawResult: true, runValidators: true, upsert: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({
                status: "deleted",
                data: { params: req.params },
                errors: [],
            });
        }
    });
});
// check item in shopping list
router.get("/:listId/item/:itemid/mark", isAuthenticated_1.default, isOwnerOrContributor_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $set: { items: { _id: req.params.itemid, checked: true } },
    }, { new: true, rawResult: true, runValidators: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(200).json({
                status: "updated",
                data: { params: req.params },
                errors: [],
            });
        }
    });
});
// add contributor
router.post("/:listId/contributor", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $push: { contributors: req.body },
    }, { new: true, rawResult: true, runValidators: true }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(204).json({
                status: "updated",
                errors: [],
                data: { params: req.params, body: req.body },
            });
        }
    });
});
// delete contributor
router.delete("/:listId/contributor/:contributorid", isAuthenticated_1.default, isOwner_1.default, function (req, res) {
    ShoppingList_1.default.findByIdAndUpdate(req.params.listId, {
        $pull: { contributors: { _id: req.params.contributorid } },
    }, function (err) {
        if (err) {
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        }
        else {
            return res.status(204).json({
                status: "updated",
                errors: [],
                data: { params: req.params },
            });
        }
    });
});
exports.default = router;
