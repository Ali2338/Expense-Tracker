require('dotenv').config();
//console.log("MONGO_URI from .env:", process.env.MONGO_URI);
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const app = express();
const authRoutes = require('./routes/authRoutes');
const incomeRoutes = require('./routes/incomeRoutes');
const expenseRoutes = require('./routes/expenseRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
app.use(cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET","POST","PUT","DELETE"],
    allowedHeaders:["Content-Type","Authorization"],
}));

app.use(express.json());

connectDB();

app.use('/api/v1/auth',authRoutes);
app.use('/api/v1/income',incomeRoutes);
app.use('/api/v1/expense',expenseRoutes);
app.use('/api/v1/dashboard',dashboardRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);

});