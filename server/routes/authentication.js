const router = require('express').Router();
const authentication = require('../controllers/authentication');
const auth = require('../middlewares/auth');
const responses = require('../utilities/responses');

router.post('/register',
    authentication.register,
    auth.signToken,
    responses.signupSuccess
);

router.post('/login',
    authentication.login,
    auth.continueTheLoginProcess,
    auth.signToken,
    responses.loginSuccess
);

router.get('/logout',
    auth.protect,
    authentication.logout
);

module.exports = router;