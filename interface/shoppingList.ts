import mongoose from "mongoose";
import IItem from "./item";

export default interface IShoppingList extends mongoose.Document {
  name: String;
  items: Array<IItem>;
  owner: mongoose.Schema.Types.ObjectId;
  contributors: Array<mongoose.Schema.Types.ObjectId>;
}
