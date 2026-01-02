const express = require('express');
const { getAllRoles } = require('../controllers/role.controller');


const router = express.Router();


router.get('/all', getAllRoles);

module.exports = router;