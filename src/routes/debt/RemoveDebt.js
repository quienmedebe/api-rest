const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Errors = require('../../modules/errors');
const Debt = require('../../modules/debt');

const RemoveDebt = ({logger = noopLogger}) =>
  async function RemoveDebt(req, res) {
    const ajv = new Ajv({logger});
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
      logger.info('Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {id: debtId} = req.params;
    const {id: accountId} = req.user;

    const removedDebt = await Debt.functions.removeDebt({
      accountId: accountId,
      debtId: debtId,
    });

    if (removedDebt.error) {
      return Errors.sendApiError(res, removedDebt);
    }

    const response = {
      result: removedDebt,
    };

    return res.status(200).json(response);
  };

module.exports = RemoveDebt;
