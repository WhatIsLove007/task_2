const bcrypt = require('bcrypt');

module.exports.hash = async password => await bcrypt.hash(password, 10);