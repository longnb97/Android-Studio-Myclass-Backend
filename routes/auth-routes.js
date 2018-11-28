const express = require('express');
const router = express.Router();

router.use('/', (req, res, next) => {
    console.log('auth-routes middleware');
})

module.exports = router;