import mongoose from "mongoose";
export default interface IUser extends mongoose.Document {
  username: string;
  password: string;
}
