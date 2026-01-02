const express = require('express');

const isAuth = require("../middlewares/isAuth");
const hashRole = require("../middlewares/hashRole");
const { getAllUsers, getOneUser, updateUser, deleteUser } = require('../controllers/user.controller');


const router = express.Router();

router.get('/test', (req, res) => {
  res.end("User route is working!👋🌍");
});

router.get('/all', isAuth, hashRole('ADMIN'), getAllUsers);
router.get('/:id', isAuth, hashRole('ADMIN'), getOneUser);
router.put('/:id', isAuth, hashRole('ADMIN'), updateUser);
router.delete('/:id', isAuth, hashRole('ADMIN'), deleteUser);

module.exports = router;