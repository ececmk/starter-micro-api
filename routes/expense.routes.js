const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Expense = require("../models/Expense.model");
const User = require("../models/User.model");

router.post("/expense", isAuthenticated, (req, res, next) => {
  const { title, description, expense, category } = req.body;

  const userId = req.payload._id;

  Expense.create({ title, description, expense, category, user: userId })
    .then((response) => res.json(response))
    .catch((err) => res.json(err));
});

router.get("/expense", isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;

  Expense.find({ user: userId })
    .then((expenses) => res.json(expenses))
    .catch((err) => res.json(err));
});

router.get("/expense/:expenseID", (req, res, next) => {
  const { expenseID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expenseID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Expense.findById(expenseID)
    .then((expense) => res.status(200).json(expense))
    .catch((error) => res.json(error));
});

router.put("/expense/:expenseID", (req, res, next) => {
  const { expenseID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expenseID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Expense.findByIdAndUpdate(expenseID, req.body, { new: true })
    .then((updatedExpense) => res.json(updatedExpense))
    .catch((error) => res.json(error));
});

router.delete("/expense/:expenseID",isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  console.log("testLog");
  const { expenseID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(expenseID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Expense.findByIdAndRemove(expenseID)
    .then(() => {
      return (
      Expense.find({ user: userId })
        .then((expenses) => {console.log(expenses)
          res.json(expenses)})
        .catch((err) => res.json(err)));
    })
    .catch((error) => res.json(error));
});

module.exports = router;
