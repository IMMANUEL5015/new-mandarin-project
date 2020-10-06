const router = require('express').Router();
const auth = require('../middlewares/auth');
const products = require('../controllers/products');
const permissions = require('../middlewares/permissions');

router.get('/',
    products.seeAllProducts
);

router.post('/',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    products.addNewProduct
);

module.exports = router;