"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var dotenv_1 = __importDefault(require("dotenv"));
var mongoose_1 = __importDefault(require("mongoose"));
var shoppingListController_1 = __importDefault(require("./controller/shoppingListController"));
var authController_1 = __importDefault(require("./controller/authController"));
var app = (0, express_1.default)();
dotenv_1.default.config();
var PORT = process.env.PORT || 8000;
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.use("/api/shoppinglist", shoppingListController_1.default);
app.use("/api/auth", authController_1.default);
mongoose_1.default
    .connect(process.env.DB_STRING)
    .then(function () {
    console.log("connected to db");
})
    .catch(function (e) {
    console.log("there was problem connecting to mongo db, reason: ".concat(e));
});
app.listen(PORT, function () {
    console.log("server running at port ".concat(PORT));
});
