const User = require('../models/user');

//User Registration
exports.createUser = async (req, res, next) => {
    try {
        //Create the user
        const { name, email, password, confirmPassword } = req.body;
        await User.create({ name, email, password, confirmPassword });

        // Hash the password

        // Log the user into the application immediately

        //Send the user a welcome email

        //Send an email to each user except customers and delivery agents

        //Send a notification to each user except customers, super-employee and delivery agents

        //Send a response to the client
    } catch (err) {
        console.error(err.message);
        return res.status(500).json({ status: 'error', msg: 'Internal Server Error!' });
    }
}