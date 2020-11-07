const Ajv = require('ajv');
const Errors = require('../../modules/errors');
const Debt = require('../../modules/debt');

const EditDebt = ({logger}) =>
  async function EditDebt(req, res) {
    const ajv = new Ajv({logger});
    const {id: debtId} = req.params;
    const {amount, type} = req.body;

    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['id'],
        properties: {
          debtId: Debt.validation.publicIdSchema,
          amount: Debt.validation.amountSchema,
          type: Debt.validation.typeSchema,
        },
      },
      {debtId, amount, type}
    );

    const isAmountDefined = typeof amount === 'undefined';
    const isTypeDefined = typeof type === 'undefined';

    if (!areValidArguments || (isAmountDefined && isTypeDefined)) {
      logger.log('info', 'Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    const {id: accountId} = req.user;

    const editedDate = await Debt.functions.editDebt({
      accountId: accountId,
      debtId: debtId,
      amount,
      type,
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
