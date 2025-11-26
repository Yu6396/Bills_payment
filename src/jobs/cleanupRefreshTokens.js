// src/jobs/cleanupRefreshTokens.js
const { RefreshToken } = require("../../models");  
const cleanupExpiredTokens = async () => {
  await RefreshToken.destroy({
    where: {
      expires_at: { [Op.lt]: new Date() },
    },
  });
};

module.exports = cleanupExpiredTokens;
