const router = require('express').Router();
const authRoutes = require('../routes/authentication');
const productsRoutes = require('../routes/products');
const foodOrdersRoutes = require('../routes/foodOrders');
const cateringOrderRoutes = require('../routes/cateringOrder');
const userRoutes = require('../routes/users');
const globalErrorHandler = require('../middlewares/errors');
const AppError = require('../utilities/appError');

router.use('/api/v1', authRoutes);
router.use('/api/v1/products', productsRoutes);
router.use('/api/v1/food_orders', foodOrdersRoutes);
router.use('/api/v1/catering_orders', cateringOrderRoutes);
router.use('/api/v1/users', userRoutes);

router.all('*', (req, res, next) => {
    return next(new AppError('The page you requested cannot be found!', 404));
});

router.use(globalErrorHandler);

module.exports = router;