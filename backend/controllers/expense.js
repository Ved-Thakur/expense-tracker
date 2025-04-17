//const  useGlobalContext  = require("../../frontend/src/context/globalContext")
const ExpenseSchema = require("../models/ExpenseModel")
const jwt = require("jsonwebtoken")

// const {totalbalance} = useGlobalContext()

exports.addExpense = async (req, res) => {
    const { UserID, title, amount, category, description, date } = req.body
    const expense = ExpenseSchema({
        title,
        amount,
        category,
        description,
        date,
        userOwner: UserID,
    })

    try {
        //validations
        if (!title || !category || !description || !date) {
            return res.status(400).json({ message: 'All fields are required!' })
        }
        if (amount <= 0 || !amount === 'number') {
            return res.status(400).json({ message: 'Amount must be a positive number!' })
        }
        await expense.save()
        res.status(200).json({ message: 'Expense Added' })
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }

    console.log(expense)
}

exports.getExpense = async (req, res) => {
    const token = req.cookies.access_token
    const UserID = jwt.verify(token, "sec_key")
    console.log(UserID)
    if (!UserID)
        return res.status(401).json({ message: "No User ID found" })
    try {
        const expenses = await ExpenseSchema.find({ userOwner: UserID.id }).sort({ createdAt: -1 })
        console.log(expenses)
        res.status(200).json(expenses)
    } catch (error) {
        res.status(500).json({ message: 'Server Error' })
    }
}

exports.deleteExpense = async (req, res) => {
    const { id } = req.params;
    ExpenseSchema.findByIdAndDelete(id)
        .then((expense) => {
            res.status(200).json({ message: 'Expense Deleted' })
        })
        .catch((err) => {
            res.status(500).json({ message: 'Server Error' })
        })
}