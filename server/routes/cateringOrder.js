const router = require('express').Router();
const cateringOrder = require('../controllers/cateringOrder');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const orders = require('../middlewares/orders');
const cateringOrdersMiddlewares = require('../middlewares/cateringOrders');
const commentRoutes = require('./comment');
const fileUpload = require('../middlewares/fileUpload');

router.use('/:catering_order_id/comments', commentRoutes);


router.post('/',
    auth.protect,
    permissions.checkRole('customer'),
    orders.ensureThatThereAreProducts,
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

router.patch('/:catering_order_id/accept-catering-order',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderHandler,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrdersMiddlewares.checkForAcceptance,
    cateringOrdersMiddlewares.calcTotalCost,
    cateringOrder.acceptCateringOrder
);

router.delete('/:catering_order_id/decline-catering-order',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderHandler,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrdersMiddlewares.checkForAcceptance,
    cateringOrder.deleteCateringOrder
);

router.patch('/:catering_order_id/upload-payment-evidence',
    auth.protect,
    permissions.checkRole('customer'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderOwnership,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrdersMiddlewares.ensureAcceptance,
    fileUpload.uploadPhoto,
    fileUpload.resizePhoto,
    cateringOrder.submitPaymentEvidence
);

router.patch('/:catering_order_id/paid',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderHandler,
    cateringOrdersMiddlewares.checkIfCateringOrderCanBeModified,
    cateringOrder.markAsPaid
);

router.patch('/:catering_order_id/delivered',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    cateringOrder.specificCateringOrder,
    cateringOrdersMiddlewares.checkCateringOrderHandler,
    cateringOrdersMiddlewares.checkIfCateringOrderHasBeenPaidFor,
    cateringOrdersMiddlewares.checkIfCateringOrderHasAlreadyBeenDelivered,
    cateringOrder.markAsDelivered
);

module.exports = router;