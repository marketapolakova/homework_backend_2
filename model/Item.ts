import mongoose, { Schema } from "mongoose";
import IItem from "../interface/item";

export const itemSchema = new Schema<IItem>({
  name: {
    type: String,
    required: [true, "name is required"],
    minlength: [3, "Min length of name is 3 characters"],
    maxlength: [30, "Max length of name is 30 characters"],
  },
  checked: {
    type: Boolean,
    required: true,
    default: false,
  },
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
