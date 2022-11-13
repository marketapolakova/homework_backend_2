"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var isAuthenticated = function (req, res, next) {
    var authHeader = req.headers["authorization"];
    var token = authHeader && authHeader.split(" ")[1];
    if (!token)
        return res.status(401).json({ status: "error", errors: ["unauthorized"] });
    jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET, function (err, user) {
        if (err)
            return res.status(403).json({ status: "error", errors: [err] });
        console.log(user);
        req.user = user;
        next();
    });
};
exports.default = isAuthenticated;
