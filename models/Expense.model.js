const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const expenseSchema = new Schema({
  title: { type: String },
  description: { type: String },
  expense: { type: Number },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  category: { type: String },
});

module.exports = model("Expense", expenseSchema);

