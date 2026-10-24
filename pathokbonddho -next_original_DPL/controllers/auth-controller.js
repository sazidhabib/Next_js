const { User, Role } = require("../models");
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

    const userExist = await User.findOne({ 
      where: { email },
      include: [{ model: Role, as: 'roleRelation' }]
    });

    if (!userExist) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isPasswordValid = await userExist.comparePassword(password);

    if (isPasswordValid) {
      if (!userExist.isActive) {
        return res.status(403).json({ msg: "Unauthorized: Account is deactivated" });
      }

      const token = await userExist.generateToken();

      return res.status(200).json({
        msg: "Login success",
        token,
        userId: userExist.id,
        username: userExist.username,
        email: userExist.email,
        isAdmin: userExist.isAdmin,
        role: userExist.role,
        roleId: userExist.roleId,
        roleName: userExist.roleRelation ? userExist.roleRelation.name : null,
        permissions: userExist.permissions
      });
    } else {
      return res.status(400).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ msg: "Internal server error", error: error.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    return res.status(200).json({
      user: {
        id: user.id,
        userId: user.id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        role: user.role,
        roleId: user.roleId,
        roleName: user.roleRelation ? user.roleRelation.name : null,
        permissions: user.permissions,
        isAdmin: user.isAdmin,
        isActive: user.isActive
      }
    });
  } catch (error) {
    console.error("getMe error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { home, register, login, getMe };