const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const authRoutes = require('./routes/authRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 8989;

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/truckbazaar', authRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
