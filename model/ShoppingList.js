const mongoose = require("mongoose");
const { Schema } = require("mongoose");

const { itemSchema } = require("./Item");

const shoppingListSchema = new Schema({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [3, "Min length of name is 3 characters"],
    maxlength: [30, "Max length of name is 30 characters"],
  },
  items: [itemSchema],
  owner: { type: Schema.Types.ObjectId, ref: "User" },
  contributors: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const ShoppingList = mongoose.model("ShoppingList", shoppingListSchema);
module.exports = ShoppingList;
