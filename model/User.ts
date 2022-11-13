import mongoose, { Schema } from "mongoose";
import IUser from "../interface/user";

const userSchema = new Schema<IUser>({
  username: {
    type: String,
    required: [true, "username is required"],
    minlength: [3, "min length for username is 3 characters"],
    maxlength: [15, "maximum length for username is 15 characters"],
  },
  password: { type: String, required: true },
});

const User = mongoose.model("User", userSchema);
export default User;
