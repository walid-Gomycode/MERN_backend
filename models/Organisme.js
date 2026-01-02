const mongoose = require("mongoose");

const organismeSchema = new mongoose.Schema(
  {
    abrege: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true, // Typically uppercase :DGTI, MINISTERE...
    },
    nomComplet: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true, versionKey: false }
); 

const Organisme = mongoose.model("CollectionOrganisme", organismeSchema);

module.exports = Organisme;