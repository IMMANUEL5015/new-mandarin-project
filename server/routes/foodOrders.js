const router = require('express').Router();
const auth = require('../middlewares/auth');
const foodOrders = require('../controllers/foodOrders');
const permissions = require('../middlewares/permissions');
const foodOrdersMiddlewares = require('../middlewares/foodOrders');

router.post('/',
    auth.protect,
    permissions('customer', 'developer'),
    foodOrdersMiddlewares.ensureThatThereAreProducts,
    foodOrdersMiddlewares.checkIfProductsAreOnTheMenu,
    foodOrdersMiddlewares.calcTotalCost,
    foodOrders.placeOrder
);

router.get('/',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee', 'delivery-agent'),
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
    permissions('developer', 'customer'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.checkFoodOrderOwnership,
    foodOrdersMiddlewares.checkIfProductsAreOnTheMenu,
    foodOrdersMiddlewares.calcTotalCost,
    foodOrdersMiddlewares.checkIfFoodOrderCanBeModified,
    foodOrders.updateFoodOrder
);

router.delete('/:food_order_id',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee', 'customer'),
    foodOrders.seeSpecificFoodOrder,
    foodOrdersMiddlewares.checkFoodOrderOwnership,
    foodOrdersMiddlewares.checkIfFoodOrderCanBeModified,
    foodOrders.deleteFoodOrder
);

router.patch('/:food_order_id/enroute',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    foodOrders.seeSpecificFoodOrder,
    foodOrders.enRoute
);

module.exports = router;