const Shared = require('../../../modules/shared');
const {Account, AppleProvider} = require('../../models');

async function createOrGetWithUpdateAccountFromAppleId(appleId, appleEmail) {
  if (!Shared.isString(appleId, {strict: true}) || !Shared.isString(appleEmail, {strict: false})) {
    throw new Error('The Apple id and email must be strings');
  }

  const account = await Account.findCreateFind({
    include: [
      {
        model: AppleProvider,
        as: 'apple_providers',
        required: true,
        where: {
          id: appleId,
        },
      },
    ],
  });

  // Not sure if after the first one the email is null or undefined. If it were null, we should remove the appleEmail === null or think about another solution
  if (appleEmail || appleEmail === null) {
    const appleProvider = account.apple_providers.find(provider => provider.id === appleId);
    appleProvider.email = appleEmail;
    await appleProvider.save();
  }

  return account;
}

module.exports = createOrGetWithUpdateAccountFromAppleId;
