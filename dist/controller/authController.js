"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var bcrypt_1 = __importDefault(require("bcrypt"));
var jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
var User_1 = __importDefault(require("../model/User"));
var router = express_1.default.Router();
router.post("/register", function (req, res) {
    var body = req.body;
    console.log(req.body);
    if (!(body.username || body.password)) {
        res
            .status(400)
            .json({ status: "error", errors: ["username or password missing"] });
    }
    else {
        User_1.default.findOne({ username: body.username }, function (err, foundUser) {
            if (foundUser) {
                res
                    .status(400)
                    .json({ status: "error", errors: ["username already exists"] });
            }
            else if (err) {
                res.status(400).json({ status: "error", errors: [err] });
            }
            else {
                bcrypt_1.default.hash(body.password, 10, function (err, hash) {
                    if (err)
                        res.status(400).json({ status: "error", errors: [err] });
                    var user = new User_1.default({
                        username: body.username,
                        password: hash,
                    });
                    user.save();
                    res.status(200).json({ status: "user created", errors: [] });
                });
            }
        });
    }
});
router.post("/login", function (req, res) {
    var body = req.body;
    User_1.default.findOne({ username: body.username }, function (err, foundUser) {
        if (!foundUser) {
            res.status(400).json({
                status: "error",
                errors: ["username or password incorrect"],
            });
        }
        else if (err) {
            res.status(400).json({ status: "error", errors: [err] });
        }
        else {
            bcrypt_1.default.compare(body.password, foundUser.password, function (err, result) {
                if (err) {
                    res.status(400).json({ status: "error", errors: [err] });
                }
                else if (!result) {
                    res.status(400).json({
                        status: "error",
                        errors: ["username or password incorrect"],
                    });
                }
                else {
                    var token = jsonwebtoken_1.default.sign({ foundUser: foundUser }, process.env.JWT_SECRET, {
                        expiresIn: "7d",
                    });
                    res.status(200).json({ status: "logged in", errors: [], token: token });
                }
            });
        }
    });
});
exports.default = router;
