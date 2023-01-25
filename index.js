require('dotenv').config();
require('express-async-errors');
const connectDB = require('./db/connection');

const express = require('express');
const app = express();

const cors = require('cors');

app.use(cors());
app.use(express.json());

// routes
const authRouter = require('./routes/auth');


// middleware
const errorHandlerMiddleware = require('./middleware/errorHandler');

app.use('/api/v1/auth', authRouter)

app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(PORT, () =>
      console.log(`server started on port http://localhost:${PORT}`)
    );
  } catch (err) {
    console.log(err);
  }
};

start();
