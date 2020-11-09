const Ajv = require('ajv');
const noopLogger = require('noop-logger');
const Errors = require('../../modules/errors');
const Debt = require('../../modules/debt');

const EditDebt = ({logger = noopLogger}) =>
  async function EditDebt(req, res) {
    const ajv = new Ajv({logger, allErrors: true});
    const {id: debtId} = req.params;
    const {amount, type, status} = req.body;

    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['debtId'],
        properties: {
          debtId: Debt.validation.publicIdSchema,
          amount: Debt.validation.amountSchema,
          type: Debt.validation.typeSchema,
          status: Debt.validation.statusSchema,
        },
      },
      {debtId, amount, type, status}
    );

    const isAmountUndefined = typeof amount === 'undefined';
    const isTypeUndefined = typeof type === 'undefined';
    const isStatusUndefined = typeof status === 'undefined';

    if (!areValidArguments || (isAmountUndefined && isTypeUndefined && isStatusUndefined)) {
      logger.info('Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {id: accountId} = req.user;

    const editedDate = await Debt.functions.editDebt({
      accountId: accountId,
      debtId: debtId,
      amount,
      type,
      status,
    });

    if (editedDate.error) {
      return Errors.sendApiError(res, editedDate);
    }

    const response = {
      result: editedDate,
    };

    return res.status(200).json(response);
  };

module.exports = EditDebt;
