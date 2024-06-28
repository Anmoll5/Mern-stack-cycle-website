const express = require('express');
const connectDB = require('./config/db');
const bodyParser = require('body-parser');
const userRoute = require ('./Routes/userRoute')
require('dotenv').config(); // Load environment variables
const cookieParser = require('cookie-parser');
const cors = require('cors');


const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(bodyParser.json());
app.use(cors());
app.use(cookieParser());

// Define Routes
app.use('/users',userRoute);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
