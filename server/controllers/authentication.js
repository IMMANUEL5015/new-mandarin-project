const User = require('../models/user');

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, confirmPassword } = req.body;
        const user = await User.create({ name, email, password, confirmPassword });

        //Send the user a welcome email

        //Send an email to each user except customers, super-employee and delivery agents

        //Send a notification to each user except customers, super-employee and delivery agents
        req.user = user;
        return next();
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
}