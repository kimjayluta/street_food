const express = require('express');
const cors = require('cors');
const db = require('./config/db');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const pwestoRoutes = require('./routes/pwesto');
app.use('/pwesto', pwestoRoutes);

const tinderaRoutes = require('./routes/tindera');
app.use('/tindera', tinderaRoutes);

const panindaRoutes = require('./routes/paninda');
app.use('/paninda', panindaRoutes);

const salesLogRoutes = require('./routes/salesLogs');
app.use('/sales_logs', salesLogRoutes);

const expenseRoutes = require('./routes/expenses');
app.use('/expenses', expenseRoutes);

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

