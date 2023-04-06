const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const userSchema = new Schema({
  email: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  income: { type: Schema.Types.ObjectId, ref: "Income" },
  expense: { type: Schema.Types.ObjectId, ref: "Expense" },
});

module.exports = model("User", userSchema);
