const fs = require("fs");

const removeUploadImage = (file) => {
  if (!file || !file.path) return;
  fs.unlink(file.path, (err) => {
    if (err && err.code !== "ENOENT") {
      console.error("Failed to remove uploadFile :", err.message);
    }
  });
};

module.exports = removeUploadImage;
