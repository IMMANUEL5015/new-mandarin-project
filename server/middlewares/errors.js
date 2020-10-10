module.exports = (err, req, res, next) => {
    return res.status(500).json({
        status: 'error',
        msg: err.message
    });
}