const Role = require("../models/Role");

exports.getAllRoles = async (req, res) => {
  try {
    const listRoles = await Role.find();
    res.status(200).json({ message: "List of roles", listRoles });
  } catch (error) {
    res.status(500).json({ message: "error server" });
  }
};

