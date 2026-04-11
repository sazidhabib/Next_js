const User = require("../models/user-model");
const bcrypt = require("bcryptjs");

const home = async (req, res) => {
  try {
    res.status(200).send("Hello World my name is Sazid this is from auth controller.");
  } catch (error) {
    console.log(error);
  }
};

const register = async (req, res, next) => {
  try {
    console.log("Received data:", req.body);
    const { username, email, phone, password, isAdmin } = req.body;
    console.log("Parsed isAdmin:", isAdmin);

    // Check if user exists
    const userExist = await User.findOne({ where: { email } });

    if (userExist) {
      return res.status(400).json({ msg: "User already exists" });
    }

    const isAdminValue = isAdmin === true || isAdmin === "true";
    console.log("Final isAdmin value:", isAdminValue);

    const userCreated = await User.create({
      username,
      email,
      phone,
      password,
      isAdmin: isAdminValue
    });

    res.status(200).json({
      msg: "User Created.",
      token: await userCreated.generateToken(),
      userId: userCreated.id,
      isAdmin: userCreated.isAdmin
    });

  } catch (error) {
    next(error);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const userExist = await User.findOne({ where: { email } });

    if (!userExist) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      return res.status(200).json({
        msg: "Login success",
        token: await userExist.generateToken(),
        userId: userExist.id,
        isAdmin: userExist.isAdmin
      });
    } else {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

module.exports = { home, register, login };