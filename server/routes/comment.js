const router = require('express').Router({ mergeParams: true });
const comment = require('../controllers/comment');
const auth = require('../middlewares/auth');
const permissions = require('../middlewares/permissions');
const commentMiddlewares = require('../middlewares/comment');
const cateringOrder = require('../controllers/cateringOrder');

router.post('/', auth.protect,
    cateringOrder.specificCateringOrder,
    permissions.confirmRightToComment,
    commentMiddlewares.checkIfCateringOrderCanBeModified,
    comment.createComment);

router.get('/', auth.protect,
    cateringOrder.specificCateringOrder,
    permissions.confirmRightToComment,
    comment.seeAllComments);

router.get('/:comment_id', auth.protect,
    cateringOrder.specificCateringOrder,
    permissions.confirmRightToComment,
    commentMiddlewares.findComment,
    comment.seeSpecificComment);

router.patch('/:comment_id',
    auth.protect,
    cateringOrder.specificCateringOrder,
    commentMiddlewares.checkIfCateringOrderCanBeModified,
    commentMiddlewares.findComment,
    permissions.checkIfLoggedInUserWroteTheComment,
    comment.updatepecificComment);

module.exports = router;