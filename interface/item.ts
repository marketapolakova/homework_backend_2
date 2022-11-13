import mongoose from "mongoose";
export default interface IItem extends mongoose.Document {
  name: string;
  checked: boolean;
}
