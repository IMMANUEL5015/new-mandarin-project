const router = require('express').Router();
const auth = require('../middlewares/auth');
const products = require('../controllers/products');
const permissions = require('../middlewares/permissions');
const fileUpload = require('../utilities/fileUpload');

router.get('/',
    products.seeAllProducts
);

router.post('/',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    fileUpload.uploadPhoto,
    fileUpload.resizePhotoForProductCreate,
    products.addNewProduct
);

router.get('/:product_id',
    products.seeSpecificProduct
);

router.patch('/:product_id',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    fileUpload.uploadPhoto,
    fileUpload.resizePhotoForProductUpdate,
    products.updateProduct
);

router.delete('/:product_id',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager', 'super-employee'),
    products.deleteProduct
);

module.exports = router;