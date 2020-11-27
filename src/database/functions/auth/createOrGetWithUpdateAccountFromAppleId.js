const Shared = require('../../../modules/shared');
const {Account, AppleProvider, sequelize} = require('../../models');

async function createOrGetWithUpdateAccountFromAppleId(appleId, appleEmail) {
  if (!Shared.isString(appleId, {strict: true}) || !Shared.isString(appleEmail, {strict: false})) {
    throw new Error('The Apple id and email must be strings');
  }

  const account = await sequelize.transaction(async t => {
    let existingAccount = await Account.findOne({
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
      transaction: t,
    });

    if (!existingAccount) {
      existingAccount = await Account.create(
        {
          apple_providers: [
            {
              id: appleId,
              email: appleEmail,
            },
          ],
        },
        {
          include: [
            {
              model: AppleProvider,
              as: 'apple_providers',
            },
          ],
          transaction: t,
        }
      );
    }

    if (appleEmail || appleEmail === null) {
      const appleProvider = existingAccount.apple_providers.find(provider => provider.id === appleId);
      appleProvider.email = appleEmail;
      await appleProvider.save({transaction: t});
    }

    return existingAccount;
  });

  return account;
}

module.exports = createOrGetWithUpdateAccountFromAppleId;
