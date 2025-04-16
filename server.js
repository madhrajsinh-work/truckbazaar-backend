const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./db/db');
const userRoutes = require('./routes/userRoutes');

dotenv.config();
const app = express();
const port = process.env.PORT || 8989;

app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/',userRoutes);

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
