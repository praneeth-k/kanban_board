import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: [3, "Name can contain 3-15 characters"],
    max: [15, "Name can contain 3-15 characters"],
    validate: {
      validator: function (v: string) {
        return /^[\w_]{3,15}$/.test(v);
      },
      message:
        "Name should contain 3-15 characters and can only include digits, alphabets and _",
    },
  },
  password: {
    type: String,
    required: true,
    validate: {
      validator: function (v: string) {
        return /^[\w_]{4}$/.test(v);
      },
      message:
        "Password should contain 4 characters and can only include digits, alphabets and _",
    },
  },
});

userSchema.post("validate", (doc, next) => {
  doc.password = bcrypt.hashSync(doc.password, 10);
  return next();
});

const User = mongoose.model("User", userSchema);

export default User;
