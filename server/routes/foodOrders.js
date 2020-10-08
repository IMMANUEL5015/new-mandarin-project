const router = require('express').Router();
const auth = require('../middlewares/auth');
const foodOrders = require('../controllers/foodOrders');
const permissions = require('../middlewares/permissions');
const foodOrdersMiddlewares = require('../middlewares/foodOrders');

router.post('/',
    auth.protect,
    permissions('customer', 'developer'),
    foodOrdersMiddlewares.checkIfProductsAreOnTheMenu,
    foodOrdersMiddlewares.calcTotalCost,
    foodOrders.placeOrder
);

module.exports = router;