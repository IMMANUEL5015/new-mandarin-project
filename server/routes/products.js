const router = require('express').Router();
const auth = require('../middlewares/auth');
const products = require('../controllers/products');

router.post('/',
    auth.protect,
    products.addNewProduct
);

module.exports = router;