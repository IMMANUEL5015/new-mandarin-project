const router = require('express').Router();
const authRoutes = require('../routes/authentication');
const productsRoutes = require('../routes/products');
const foodOrdersRoutes = require('../routes/foodOrders');
const globalErrorHandler = require('../middlewares/errors');

router.use('/api/v1', authRoutes);
router.use('/api/v1/products', productsRoutes);
router.use('/api/v1/food_orders', foodOrdersRoutes);

router.use(globalErrorHandler);

module.exports = router;