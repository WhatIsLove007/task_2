const bcrypt = require('bcrypt');

module.exports.hash = async password => {

   return await bcrypt.hash(password, 10)

}