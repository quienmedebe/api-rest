const {EmailToken, Sequelize} = require('../../models');

async function getValidEmailToken(tokenId, attributes = {}, options = {}) {
  const {emailProviderId} = attributes;

  const response = await EmailToken.findOne({
    where: {
      id: tokenId,
      email_provider_id: emailProviderId,
      valid: true,
      expiration_datetime: {
        [Sequelize.Op.gte]: Date.now(),
      },
    },
    ...options,
  });

  return response;
}

module.exports = getValidEmailToken;
