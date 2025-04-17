const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        trim: true,
        maxLength: 50
    },
    email: {
        type: String,
        //required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    incomes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Income'
    }],
    expenses: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Expense'
    }],
}, {timestamps: true});

const UserModel = mongoose.model('User', UserSchema);
module.exports = UserModel
