const router = require('express').Router();
const cateringOrder = require('../controllers/cateringOrder');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const orders = require('../middlewares/orders');
const cateringOrdersMiddlewares = require('../middlewares/cateringOrders');
const commentRoutes = require('./comment');

router.use('/:catering_order_id/comments', commentRoutes);


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

router.get('/my_catering_orders',
    auth.protect,
    cateringOrder.seeMyCateringOrders
);

router.get('/:catering_order_id',
    auth.protect,
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderOwnership,
    cateringOrdersMiddlewares.retrievedCateringOrder
);

router.patch('/:catering_order_id',
    auth.protect,
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderOwnership,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrdersMiddlewares.calcTotalCost,
    cateringOrder.updateCateringOrder
);

router.delete('/:catering_order_id',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee', 'customer'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderOwnership,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrder.deleteCateringOrder
);

router.patch('/:catering_order_id/assign-handler',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrder.assignSuperEmployee
);

router.get('/handler/my-catering-orders',
    auth.protect,
    permissions.checkRole('super-employee'),
    cateringOrder.getHandlerCateringOrders
);

module.exports = router;