const router = require('express').Router();
const cateringOrder = require('../controllers/cateringOrder');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const foodOrdersMiddlewares = require('../middlewares/foodOrders');
const cateringOrdersMiddlewares = require('../middlewares/cateringOrders');


router.post('/',
    auth.protect,
    permissions.checkRole('customer'),
    foodOrdersMiddlewares.ensureThatThereAreProducts,
    cateringOrdersMiddlewares.calcTotalCost,
    cateringOrder.placeOrder
);

module.exports = router;