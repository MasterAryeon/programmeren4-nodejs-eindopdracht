
const config = require('../../config/config');
const moment = require('moment');
const jwt = require('jwt-simple');
const sha = require('sha.js');

//
// Encode (from username to token)
//
function encodeToken(accountId, email) {
    const payload = {
        exp: moment().add(10, 'days').unix(),
        iat: moment().unix(),
        sub: accountId,
        email: email
    };

    return jwt.encode(payload, config.key);
}

//
// Decode (from token to username)
//
function decodeToken(token, callback) {
    try {
        const payload = jwt.decode(token, config.key);
        // Check if the token has expired
        const now = moment().unix();
        if(now > payload.exp) {
            callback('Token has expired', null);
        } else {
            callback(null, payload);
        }
    } catch(error) {
        callback(error, null);
    }
}

//
// Hash a given password
//
function hashPassword(password) {
    return sha('sha256').update(password).digest('hex');
}

function isOwner(token, accountId, callback) {
    decodeToken(token, (err, payload) => {
        if(err) {
            callback(false);
        } else {
            console.log(payload.sub + ' ' + accountId);
            if(payload.sub === accountId) {
                callback(true);
            } else {
                callback(false);
            }
        }
    });
}

module.exports = { encodeToken, decodeToken, hashPassword, isOwner };