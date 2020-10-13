const router = require('express').Router({ mergeParams: true });
const comment = require('../controllers/comment');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const cateringOrder = require('../controllers/cateringOrder');

router.post('/', auth.protect,
    cateringOrder.specificCateringOrder,
    permissions.confirmRightToComment,
    comment.createComment);

router.get('/', auth.protect,
    cateringOrder.specificCateringOrder,
    permissions.confirmRightToComment,
    comment.seeAllComments);

module.exports = router;