const bcrypt = require('bcryptjs')

class Util {

    static async encrypt(password) {
        try {
            const hash = await bcrypt.hash(password, 10);
            return hash;
        } catch (err) {
            return console.log(err);
        }  
    }

    static async compare(password, hash) {
        try {
            const res = await bcrypt.compare(password, hash);
            return res;
        } catch (err) {
            return console.log(err);
        }
    }
}

module.exports = Util;