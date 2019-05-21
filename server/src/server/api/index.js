const { Router } = require('express');
const ld = require('./ld');

const router = Router();
router.use('/ld', ld);

module.exports = router;
