const router = require('express').Router();
const cateringOrder = require('../controllers/cateringOrder');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const orders = require('../middlewares/orders');
const cateringOrdersMiddlewares = require('../middlewares/cateringOrders');


router.post('/',
    auth.protect,
    permissions.checkRole('customer'),
    orders.ensureThatThereAreProducts,
    cateringOrdersMiddlewares.calcTotalCost,
    cateringOrder.placeOrder
);

router.get('/',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    cateringOrder.seeAllCateringOrders
);

module.exports = router;