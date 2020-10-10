process.on('uncaughtException', err => {
    console.error(err.name, err.message);
    console.error('Shutting down!');
    process.exit(1);
});

require('dotenv').config();
const app = require('./server/app');

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});

process.on('unhandledRejection', err => {
    console.error(err.name, err.message);
    server.close(() => {
        process.exit(1);
    });
});