"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var ShoppingList_1 = __importDefault(require("../model/ShoppingList"));
var errorResponse_1 = __importDefault(require("../utils/errorResponse"));
var isOwnerOrContributor = function (req, res, next) {
    console.log(req.params.listid);
    var userId = req.user.foundUser._id;
    ShoppingList_1.default.findById(req.params.listid, function (err, list) {
        console.log(list);
        if (err)
            return res.status(400).json(new errorResponse_1.default("error", [err]));
        if (!list)
            return res
                .status(404)
                .json(new errorResponse_1.default("error", ["no shopping list for given user"]));
        if (list.owner.toString() === userId ||
            list.contributors.includes(userId)) {
            next();
        }
        else {
            res.status(401).json(new errorResponse_1.default("error", ["unauthorized"]));
        }
    });
};
exports.default = isOwnerOrContributor;
