const router = require('express').Router();
const authentication = require('../controllers/authentication');
const auth = require('../middlewares/auth');
const responses = require('../utilities/responses');

router.post('/register',
    authentication.register,
    auth.signToken,
    responses.signupSuccess
);

module.exports = router;