import mongoose, { Schema } from "mongoose";
import IShoppingList from "../interface/shoppingList";
import { itemSchema } from "./Item";

const shoppingListSchema = new Schema<IShoppingList>({
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
export default ShoppingList;
