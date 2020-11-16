const Ajv = require('ajv');
const Debt = require('../../modules/debt');
const Errors = require('../../modules/errors');

const GetDebtByPublicId = () =>
  async function GetDebtByPublicId(req, res) {
    const ajv = new Ajv();
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['id'],
        properties: {
          id: Debt.validation.publicIdSchema,
        },
      },
      req.params
    );

    if (!areValidArguments) {
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {id: debtId} = req.params;
    const {id: accountId} = req.user;

    const debt = await Debt.functions.getDebtByPublicId({
      accountId,
      debtId,
    });

    if (!debt) {
      return Errors.sendApiError(res, Debt.ERRORS.DEBT_NOT_FOUND);
    }

    delete debt.account_id;

    return res.status(200).json({
      result: debt,
    });
  };

module.exports = GetDebtByPublicId;
