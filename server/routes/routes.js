const router = require('express').Router();
const authRoutes = require('../routes/authentication');
const productsRoutes = require('../routes/products');
const foodOrdersRoutes = require('../routes/foodOrders');

router.use('/api/v1', authRoutes);
router.use('/api/v1/products', productsRoutes);
router.use('/api/v1/food_orders', foodOrdersRoutes);

//This error handler will be adjusted later on
router.use((err, req, res, next) => {
    return res.status(500).json({
        status: 'error',
        msg: err.message
    });
});

module.exports = router;