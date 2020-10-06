const router = require('express').Router();
const auth = require('../middlewares/auth');

router.post('/', auth.protect, (req, res) => {
    res.status(200).json({
        status: 'Success',
        message: 'You have successfully created a product.'
    });
});

module.exports = router;