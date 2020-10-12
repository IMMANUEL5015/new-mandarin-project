const router = require('express').Router();
const auth = require('../middlewares/auth');
const foodOrders = require('../controllers/foodOrders');
const permissions = require('../middlewares/permissions');
const foodOrdersMiddlewares = require('../middlewares/foodOrders');

router.post('/',
    auth.protect,
    permissions.checkRole('customer', 'developer'),
    foodOrdersMiddlewares.ensureThatThereAreProducts,
    foodOrdersMiddlewares.checkIfProductsAreOnTheMenu,
    foodOrdersMiddlewares.calcTotalCost,
    foodOrders.placeOrder
);

router.get('/',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    foodOrders.seeAllFoodOrders
);

router.get('/my_food_orders',
    auth.protect,
    foodOrders.seeMyFoodOrders
);

router.get('/:food_order_id',
    auth.protect,
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.checkFoodOrderOwnership,
    foodOrdersMiddlewares.retrievedFoodOrder
);

router.patch('/:food_order_id',
    auth.protect,
    permissions.checkRole('developer', 'customer'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.checkFoodOrderOwnership,
    foodOrdersMiddlewares.checkIfProductsAreOnTheMenu,
    foodOrdersMiddlewares.calcTotalCost,
    foodOrdersMiddlewares.checkIfFoodOrderCanBeModified,
    foodOrders.updateFoodOrder
);

router.delete('/:food_order_id',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee', 'customer'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.checkFoodOrderOwnership,
    foodOrdersMiddlewares.checkIfFoodOrderCanBeModified,
    foodOrders.deleteFoodOrder
);

router.patch('/:food_order_id/enroute',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.isPaidOrCanBeDelivered,
    foodOrders.enRoute
);

router.patch('/:food_order_id/delivered',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager', 'super-employee'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.isPaidOrCanBeDelivered,
    foodOrders.delivered
);

router.patch('/:food_order_id/can-be-delivered',
    auth.protect,
    permissions.checkRole('developer', 'customer'),
    foodOrders.seeSpecificFoodOrder,
    foodOrders.canBeDelivered
);

router.get('/delivery-agent/my-food-orders',
    auth.protect,
    permissions.checkRole('delivery-agent'),
    foodOrders.getDeliveryAgentFoodOrders
);

module.exports = router;