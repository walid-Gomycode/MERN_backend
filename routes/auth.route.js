const express = require("express");
const { register, login, logout, current } = require("../controllers/auth.controller");     // {register} : with {} because we used export  (multiple in file)
const upload = require("../utils/multer");   // upload : without {} because we used module.exports (1 seule in file)
const {
  registerValidation, loginValidation
} = require("../middlewares/validations/authValidation");
const validate = require("../middlewares/validations/validator");
const isAuth = require("../middlewares/isAuth");
const hashRole = require("../middlewares/hashRole");
const router = express.Router();

router.get('/test', (req, res) => {
  res.set("Content-Type", "text/html; charset=utf-8");
  res.end("Auth route is working!👋🌍");
});

//// REGISTER USER
router.post(
  "/register",
  isAuth,
  hashRole('ADMIN'),
  upload.single("profilePicture"),
  registerValidation,
  validate,
  register
);

//// LOGIN USER
router.post("/login", loginValidation, validate, login);

//// LOGOUT USER
router.post("/logout", isAuth, logout);

//// CURRENT USER
router.get("/current", isAuth, current);


module.exports = router;
