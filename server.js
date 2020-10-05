require('dotenv').config();
const app = require('./server/app');

app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
});