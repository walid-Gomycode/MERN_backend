const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema(
  {
    titre: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Roles are typically uppercase : ADMIN, USER, MODERATOR...
    },
    permission: [{ type: String }],
  },
  { timestamps: true, versionKey: false }
); 

const Role = mongoose.model("CollectionRole", roleSchema);

module.exports = Role;
