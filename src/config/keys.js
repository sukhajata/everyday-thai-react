//keys.js
if (true) {
    module.exports = require('./keys_prod');
} else {
    module.exports = require('./keys_dev');
}