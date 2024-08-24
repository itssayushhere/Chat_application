import express from "express";
import User from "../Schema/UserSchema.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
const router = express.Router();

router.post("/register", async (req, res) => {
  const {username, email, password, name, age, phoneNumber, image ,bio} = req.body;

  const missingFields = [];
  if (!username) missingFields.push("email");
  if (!email) missingFields.push("email");
  if (!password) missingFields.push("password");
  if (!name) missingFields.push("name");
  if (!age) missingFields.push("age");

  if (missingFields.length > 0) {
    return res.status(400).json({
      message: `Missing fields ${missingFields}`,
    });
  }

  try {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const existingUserName = await User.findOne({username})
    if (existingUserName) {
      return res.status(400).json({ message: "UserName already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashpassword = await bcrypt.hash(password, salt);
    // Create new user
    const newUser = new User({
      username,
      email,
      password: hashpassword,
      name,
      age,
      phoneNumber, //
      image,
      bio
    });

    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Email Doesn't Exists" });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Wrong password" });
    }

    // Generate JWT
    const token = jwt.sign({ user_id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    // Send response
    const data = {
      id: user.id,
      name :user.username,
      email: user.email,
      username: user.name,
      age: user.age,
      phoneNumber: user.phoneNumber,
      image : user.image ? user.image : ""
    };
    res.status(200).json({ data, token });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
});
export default router;
