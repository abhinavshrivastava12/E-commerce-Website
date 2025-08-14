const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

// ✅ Email Sender Function
const sendConfirmationEmail = async (email, name) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"Abhi ShoppingZone" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Abhi ShoppingZone 🛒",
      html: `
        <h2>Hi ${name},</h2>
        <p>Thank you for registering on <strong>Abhi ShoppingZone</strong>!</p>
        <p>We're excited to have you onboard. Start shopping now!</p>
        <br/>
        <p style="font-size:14px;color:gray">© All rights reserved by Abhinav Shrivastava</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log("✅ Confirmation email sent");
  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

// ✅ REGISTER Controller
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Save user
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();

    // Send confirmation email
    await sendConfirmationEmail(email, name);

    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ LOGIN Controller
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
