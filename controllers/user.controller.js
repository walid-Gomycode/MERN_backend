const User = require("../models/User");

exports.getAllUsers = async (req, res) => {
  try {
    const listUsers = await User.find().populate("role").select("-password");
    res.status(200).json({ message: "List users", listUsers });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

exports.getOneUser = async (req, res) => {
  try {
    const userToFind = await User.findById(req.params.id)
      .populate("role")
      .select("-password");
    if (!userToFind) {
      res.status(404).json({ message: "User not found", userToFind });
    }

    res.status(200).json({ message: "User found", userToFind });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToEdit = await User.findByIdAndUpdate(id, req.body, { new: true })
      .populate("role")
      .select("-password");
    if (!userToEdit) {
      res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User updated successfully", userToEdit });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const userToDelete = await User.findByIdAndDelete(id);
    if (!userToDelete) {
      res.status(404).json({ message: "User not found" });
    }
    res
      .status(200)
      .json({ message: "User deleted successfully", userToDelete });
  } catch (error) {
    res.status(500).json({ message: "Error server", error });
  }
};
