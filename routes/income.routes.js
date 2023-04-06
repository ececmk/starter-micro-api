const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const { isAuthenticated } = require("../middleware/jwt.middleware");

const Income = require("../models/Income.model");
const User = require("../models/User.model");

router.post("/income", isAuthenticated, (req, res, next) => {
  const { title, description, income, category } = req.body;
  const { _id } = req.payload;

  Income.create({ title, description, income, category, user: _id })
    .then((response) => res.json(response))
    .catch((err) => res.status(400).json(err)); /200/
});

router.get("/income", isAuthenticated, (req, res, next) => {
  const { _id } = req.payload;

  Income.find({ user: _id })
    .then((income) => res.json(income))
    .catch((err) => {
      res.sendStatus(400);
    });
});

router.get("/income/:incomeID", (req, res, next) => {
  const { incomeID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(incomeID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Income.findById(incomeID)
    .then((income) => res.status(200).json(income))
    .catch((error) => res.json(error));
});

router.put("/income/:incomeID", (req, res, next) => {
  const { incomeID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(incomeID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Income.findByIdAndUpdate(incomeID, req.body, { new: true })
    .then((updatedIncome) => res.json(updatedIncome))
    .catch((error) => res.json(error));
});

router.delete("/income/:incomeID",isAuthenticated, (req, res, next) => {
  const userId = req.payload._id;
  console.log("testLog");
  const { incomeID } = req.params;

  if (!mongoose.Types.ObjectId.isValid(incomeID)) {
    res.status(400).json({ message: "Specified id is not valid" });
    return;
  }

  Income.findByIdAndRemove(incomeID)
    .then(() => {
    return (
      Income.find({ user: userId })
        .then((incomes) => {console.log(incomes)
          res.json(incomes)})
        .catch((err) => res.json(err)));
    })
    .catch((error) => res.json(error));
});

module.exports = router;
