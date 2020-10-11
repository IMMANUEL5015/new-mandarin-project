const router = require('express').Router();
const users = require('../controllers/users');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions.js');

router.get('/',
    auth.protect,
    permissions('developer', 'manager', 'assistant-manager'),
    users.getAllUsers
);

router.get('/:id',
    auth.protect,
    users.getSpecificUser
);

module.exports = router;