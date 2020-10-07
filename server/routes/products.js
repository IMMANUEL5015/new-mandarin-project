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

router.patch('/:product_id',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    products.updateProduct
);

router.delete('/:product_id',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    products.deleteProduct
);

module.exports = router;