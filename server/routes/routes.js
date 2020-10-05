const router = require('express').Router();
const authRoutes = require('../routes/authentication');

router.use('/api/v1', authRoutes);

module.exports = router;