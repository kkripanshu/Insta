const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();
const app = express();

const connectDB = require('./config/db');
const User = require('./models/User');
const transporter = require('./config/email');
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Define routes

app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/posts', require('./routes/post.routes'));
app.use("/api/otp", require("./routes/otp.routes"));



app.get('/', async (req, res) => {
    try {
        // Exclude password hashes from the response
        const users = await User.find({}, '-password');

        res.json({
            message: `InstaClone Server is running on port ${PORT}`,
            count: users.length,
            users,
        });
    } catch (error) {
        console.error('Failed to fetch users:', error);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"ConnectX" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER,
      subject: "ConnectX Email Test",
      text: "Email service is working 🚀",
    });

    res.send("Email sent successfully");
  } catch (err) {
    console.error(err);
    res.status(500).send("Email failed");
  }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
