const router = require('express').Router();
const users = require('../controllers/users');
const foodOrders = require('../controllers/foodOrders');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions.js');

router.get('/',
    auth.protect,
    permissions.checkRole('developer', 'manager', 'assistant-manager'),
    users.getAllUsers
);

router.get('/:id',
    auth.protect,
    permissions.checkUser,
    users.getSpecificUser
);

router.get('/:id/food-orders',
    auth.protect,
    permissions.checkUser,
    foodOrders.getCustomerFoodOrders
);

module.exports = router;