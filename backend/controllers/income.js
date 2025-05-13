const IncomeSchema = require("../models/IncomeModel");
const jwt = require("jsonwebtoken");

exports.addIncome = async (req, res) => {
  const { UserID, title, amount, category, description, date } = req.body;
  // const userID=req.user.id;
  const income = IncomeSchema({
    title,
    amount,
    category,
    description,
    date,
    userOwner: UserID,
  });

  try {
    //validations
    if (!title || !category || !description || !date) {
      return res.status(400).json({ message: "All fields are required!" });
    }
    if (amount <= 0 || !amount === "number") {
      return res
        .status(400)
        .json({ message: "Amount must be a positive number!" });
    }
    await income.save();
    res.status(200).json({ message: "Income Added" });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.getIncomes = async (req, res) => {
  const token = req.cookies.access_token;
  const UserID = jwt.verify(token, "sec_key");
  try {
    const incomes = await IncomeSchema.find({ userOwner: UserID.id }).sort({
      createdAt: -1,
    });
    res.status(200).json(incomes);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
};

exports.deleteIncome = async (req, res) => {
  const { id } = req.params;
  IncomeSchema.findByIdAndDelete(id)
    .then((income) => {
      res.status(200).json({ message: "Income Deleted" });
    })
    .catch((err) => {
      res.status(500).json({ message: "Server Error" });
    });
};
