const { validationResult } = require("express-validator");
const removeUploadImage = require("../../utils/removeUploadImage");

module.exports = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    //! remove uploaded image
    removeUploadImage(req.file);
    return res.status(400).json({
      success: false,
      errors: errors.array().map((err) => ({
        field: err.path,
        message: err.msg,
      })),
    });
  }

  next();
};
