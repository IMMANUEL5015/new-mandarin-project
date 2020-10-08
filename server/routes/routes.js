const router = require('express').Router();
const authRoutes = require('../routes/authentication');
const productsRoutes = require('../routes/products');

router.use('/api/v1', authRoutes);
router.use('/api/v1/products', productsRoutes);

//This error handler will be adjusted later on
router.use((err, req, res, next) => {
    return res.status(500).json({
        status: 'error',
        msg: err.message
    });
});

module.exports = router;