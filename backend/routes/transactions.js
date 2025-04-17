const {
  addExpense,
  getExpense,
  deleteExpense,
} = require("../controllers/expense");
const {
  addIncome,
  getIncomes,
  deleteIncome,
} = require("../controllers/income");
const { addUser, getUser, verifyToken } = require("../controllers/User");

// const  = require("../controllers/User");
const router = require("express").Router();

router.post("/add-income", addIncome);
router.get("/get-incomes", getIncomes);
router.delete("/delete-income/:id", deleteIncome);
router.post("/add-expense", addExpense);
router.get("/get-expenses", getExpense);
router.delete("/delete-expense/:id", deleteExpense);
router.post("/register", addUser);
router.post("/login", getUser);
router.post("/verify-token", verifyToken);

module.exports = router;
