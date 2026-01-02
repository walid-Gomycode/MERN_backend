const Role = require("../models/Role");
const User = require("../models/User");
//// import bcrypt
const bcrypt = require("bcrypt");
//// import jsonwebtoken
const jwt = require("jsonwebtoken");

//// import removeUploadImage utility
const removeUploadImage = require("../utils/removeUploadImage");

/// Register (create a new user)
exports.register = async (req, res) => {
  try {
    const { userName, email, password, phone, roleTitre } = req.body;
    //// image
    let profilePicture = "http://avatar.com/placeholder.png";
    if (req.file) {
      profilePicture = `${req.protocol}://${req.get("host")}/uploads/${
        req.file.filename
      }`;
      console.log(profilePicture);
    }

    /// check if name already exists
    const existingUser = await User.findOne({ userName });
    if (existingUser) {
      //! remove uploaded image ---1
      removeUploadImage(req.file);

      return res.status(400).json({
        success: false,
        errors: [{ message: "UserName already exists" }],
      });
    }

    // role exist + Normalisation (!roleTitre : null or undefined)
    if (!roleTitre || typeof roleTitre !== "string") {
      //! remove uploaded image ---2
      removeUploadImage(req.file);
      return res
        .status(400)
        .json({ success: false, errors: [{ message: "Role is required" }] });
    }

    const normRoleTitre = roleTitre.trim().toUpperCase();
    console.log(normRoleTitre);
    const existRole = await Role.findOne({ titre: normRoleTitre });
    if (!existRole) {
      //! remove uploaded image ---3
      removeUploadImage(req.file);
      return res
        .status(400)
        .json({ success: false, errors: [{ message: "Role invalid" }] });
    }

    //todo hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    /// create user
    const newUser = new User({
      userName,
      email,
      password: hashedPassword,
      phone,
      ///rajouter image
      profilePicture,
      role: existRole._id,
    });
    await newUser.save();
    res.status(201).json({
      success: true,
      message: ["User added successfully"],
      user: newUser,
    });
  } catch (error) {
    //! remove uploaded image ---4
    removeUploadImage(req.file);
    res.status(500).json({
      success: false,
      errors: [{ message: "Failure in creation user in DB" }],
    });
  }
};

/// LOGIN USER
exports.login = async (req, res) => {
  try {
    ///// check if userName exists
    const { userName, password } = req.body;

    const existingUser = await User.findOne({ userName }).populate("role");
    if (!existingUser) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Invalid credentials 1" }],
      });
    }

    ///// compare password
    const isMatch = await bcrypt.compare(password, existingUser.password);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        errors: [{ message: "Invalid credentials 2" }],
      });
    }

    ///// check if user is connected from another device or not
    //if (existingUser.) {
      //return res.status(400).json({
      //  success: false,
      //  errors: [{ message: "User already connected" }],
      //});
    //}


    ///// generate token based on userID and role and secret key
    const token = jwt.sign(
      {
        userId: existingUser._id,
        role: existingUser.role.titre,
      },
      process.env.JWT_SECRET,
      { expiresIn: "2h" }
    );

    ///// store token in cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // use secure cookies in production
      sameSite: "strict", // use strict sameSite policy : in the same site only
      maxAge: 2 * 60 * 60 * 1000, // 2 hours   (in milliseconds)
    });

    ///// respond to client
    res.status(200).json({
      success: true,
      message: ["Login successfully"],
      user: existingUser,
      //token,
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: [{ message: "Fail to connect user " }] });
  }
};

/// LOGOUT USER
exports.logout = async (req, res) => {
  try {
    ///// clear the token cookie
    res.clearCookie("token", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    ///// respond to client
    res.status(201).json({
      success: true,
      message: ["Logout successfully"],
    });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, errors: [{ message: "Error during logout" }] });
  }
};

/// CURRENT USER
exports.current = async (req, res) => {
  try {
    const foundUser = await User.findById(req.user.id).populate("role");
    if (!foundUser) {
      return res.status(404).json({
        success: false,
        errors: [{ message: "User not found" }],
      });
    }
    res.status(200).json({
      success: true,
      user: foundUser,
        });
  } catch (error) {
    res.status(500).json({
      success: false,
      errors: [{ message: "Error fetching current user" }],
    });
  }
};
