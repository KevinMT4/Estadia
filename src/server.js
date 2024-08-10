const app = require('./app');
const debug = require('debug')('app:server');

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    debug(`Server running on port ${PORT}`);
});
