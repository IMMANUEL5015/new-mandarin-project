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

router.get('/:product_id',
    products.seeSpecificProduct
);

module.exports = router;