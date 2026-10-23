require('dotenv').config();
const app = require('./app');

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Chạy tại ' + (process.env.BASE_URL || `http://localhost:${PORT}`)));
