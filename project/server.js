const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./src/config/db');
const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
const authRoutes = require('./src/routes/authRoutes');
const userRoutes = require('./src/routes/userRoutes');
const serviceRoutes = require('./src/routes/serviceRoutes');
const bookingRoutes = require('./src/routes/bookingRoutes');
const agentRoutes = require('./src/routes/agentRoutes');
const feedbackRoutes = require('./src/routes/feedbackRoutes');
const billingRoutes = require('./src/routes/billingRoutes');
const pushRoutes = require("./src/routes/push");
dotenv.config();

connectDB();

const app = express();

// app.use(cors());
app.use(cors({
  origin: "*",               // Kisi bhi frontend se request allow
  methods: ["GET","POST","PUT","DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));
app.use(express.json());
app.use("/api/push", pushRoutes);
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Physiotherapy Doorstep Service API',
    version: '1.0.0',
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/agents', agentRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/billing', billingRoutes);

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
// const express = require('express');
// const dotenv = require('dotenv');
// const cors = require('cors');
// const connectDB = require('./src/config/db');
// const { errorHandler, notFound } = require('./src/middlewares/errorMiddleware');
// const authRoutes = require('./src/routes/authRoutes');
// const userRoutes = require('./src/routes/userRoutes');
// const serviceRoutes = require('./src/routes/serviceRoutes');
// const bookingRoutes = require('./src/routes/bookingRoutes');
// const agentRoutes = require('./src/routes/agentRoutes');
// const feedbackRoutes = require('./src/routes/feedbackRoutes');
// const billingRoutes = require('./src/routes/billingRoutes');

// dotenv.config();

// connectDB();

// const app = express();

// // --- Middleware Configuration (No Change) ---
// app.use(cors({
//   origin: "*",
//   methods: ["GET","POST","PUT","DELETE"],
//   allowedHeaders: ["Content-Type", "Authorization"]
// }));
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // --- Root Route (No Change) ---
// app.get('/', (req, res) => {
//   res.json({
//     success: true,
//     message: 'Physiotherapy Doorstep Service API',
//     version: '1.0.0',
//   });
// });

// // --- API Routes (No Change) ---
// app.use('/api/auth', authRoutes);
// app.use('/api/users', userRoutes);
// app.use('/api/services', serviceRoutes);
// app.use('/api/bookings', bookingRoutes);
// app.use('/api/agents', agentRoutes);
// app.use('/api/feedback', feedbackRoutes);
// app.use('/api/billing', billingRoutes);

// // --- Error Handling (No Change) ---
// app.use(notFound);
// app.use(errorHandler);


// // ------------------------------------------------------------------
// // 🔥 MAJOR FIX FOR VERCEL: Remove app.listen and Export app
// // ------------------------------------------------------------------

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
// });

// // Vercel Serverless Function ke liye 'app' ko export karein
// module.exports = app;