const router = require('express').Router();
const authentication = require('../controllers/authentication');
const auth = require('../middlewares/auth');

router.post('/register',
    authentication.register
);

router.post('/login',
    authentication.login,
    auth.continueTheLoginProcess
);

router.get('/logout',
    auth.protect,
    authentication.logout
);

module.exports = router;