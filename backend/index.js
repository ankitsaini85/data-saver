// import express from 'express';
// import cors from 'cors';
// import dotenv from 'dotenv';
// import mongoose from 'mongoose';
// import entryRoutes from './routes/entryRoutes.js';

// dotenv.config();

// const app = express();

// const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
//   .split(',')
//   .map((origin) => origin.trim())
//   .filter(Boolean);

// // Middleware
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow non-browser requests and same-origin requests without an Origin header.
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       }

//       return callback(new Error('Not allowed by CORS'));
//     },
//     credentials: true,
//   })
// );
// app.use(express.json());

// // MongoDB Connection
// mongoose
//   .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/e-scooty')
//   .then(() => console.log('MongoDB connected'))
//   .catch((err) => console.log('MongoDB connection error:', err));

// // Routes
// app.use('/api', entryRoutes);

// // Health check
// app.get('/health', (req, res) => {
//   res.json({ message: 'Server is running' });
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Backend server running on port ${PORT}`);
// });


import express from "express";
import cors from "cors";
import fetch from "node-fetch";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// 🔐 Basic Auth
const getAuthHeader = () => {
  const key = process.env.TAZAPAY_API_KEY;
  const secret = process.env.TAZAPAY_API_SECRET;

  const base64 = Buffer.from(`${key}:${secret}`).toString("base64");
  return `Basic ${base64}`;
};

// 🚀 Create Checkout Session
app.post("/create-checkout", async (req, res) => {
  try {
    const response = await fetch(
      "https://service-sandbox.tazapay.com/v3/checkout",
      {
        method: "POST",
        headers: {
          Authorization: getAuthHeader(),
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
  invoice_currency: "USD",
  amount: 3,

  payment_methods: ["card"], // 🔥 ADD THIS

  transaction_description: "Test Payment",

  customer_details: {
    name: "Ankit",
    email: "test@example.com",
    country: "US", // 🔥 CHANGE THIS
    phone: {
      number: "1234567890",
    },
  },

  success_url: "http://localhost:5173/success",
  cancel_url: "http://localhost:5173/cancel",
}),
      }
    );

    const data = await response.json();

    console.log("TAZAPAY RESPONSE:", data);

    if (!response.ok) {
      return res.status(500).json({
        success: false,
        error: data,
      });
    }

    res.json({
      success: true,
      token: data.data.token,
    });
  } catch (err) {
    console.log("ERROR:", err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on 5000"));