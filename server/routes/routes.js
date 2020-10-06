const router = require('express').Router();
const authRoutes = require('../routes/authentication');
const productsRoutes = require('../routes/products');

router.use('/api/v1', authRoutes);
router.use('/api/v1/products', productsRoutes);

module.exports = router;