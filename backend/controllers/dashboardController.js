
const Income = require('../models/Income');
const Expense = require('../models/Expense');
const { Types, isValidObjectId } = require('mongoose');

exports.getDashboardData = async (req, res) => {
    try {
        const userId = req.user.id;
        const userObjectId = new Types.ObjectId(String(userId));

        // Fetch total income
        const totalIncome = await Income.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
          console.log("Total Income",{totalIncome , userId:isValidObjectId(userId)})
        // Fetch total expense
        const totalExpense = await Expense.aggregate([
            { $match: { userId: userObjectId } },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);

        // Transactions from last 60 days
        const last60Days = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
        const last60DaysIncomeTransactions = await Income.find({
            userId: userObjectId,
            date: { $gte: last60Days }
        }).sort({ date: -1 });

        const incomeLast60Days = last60DaysIncomeTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Transactions from last 30 days
        const last30Days = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const last30DaysExpenseTransactions = await Expense.find({
            userId: userObjectId,
            date: { $gte: last30Days }
        }).sort({ date: -1 });

        const expensesLast30Days = last30DaysExpenseTransactions.reduce((sum, transaction) => sum + transaction.amount, 0);

        // Recent 5 transactions (income + expense)
        const recentIncome = await Income.find({ userId: userObjectId }).sort({ date: -1 }).limit(5);
        const recentExpense = await Expense.find({ userId: userObjectId }).sort({ date: -1 }).limit(5);

        const lastTransactions = [
            ...recentIncome.map(txn => ({ ...txn.toObject(), type: "income" })),
            ...recentExpense.map(txn => ({ ...txn.toObject(), type: "expense" }))
        ].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 5);

        // Response
        res.json({
            totalBalance: (totalIncome[0]?.total || 0) - (totalExpense[0]?.total || 0),
            totalIncome: totalIncome[0]?.total || 0,
            totalExpense: totalExpense[0]?.total || 0,
            last30DaysExpenses: { total: expensesLast30Days, transactions: last30DaysExpenseTransactions },
            last60DaysIncome: { total: incomeLast60Days, transactions: last60DaysIncomeTransactions },
            recentTransactions: lastTransactions,
        });

    } catch (error) {
        console.error("Dashboard Error:", error);
        res.status(500).json({ message: "Server Error" });
    }
};
