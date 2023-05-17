const crypto = require('crypto');

const randomToken = (size = 16) => {
  return crypto
    .randomBytes(size)
    .toString('base64')
    .slice(0, size)
}

module.exports = randomToken;