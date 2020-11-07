const Ajv = require('ajv');
const Errors = require('../../modules/errors');
const Debt = require('../../modules/debt');

const AddDebt = ({logger}) =>
  async function AddDebt(req, res) {
    const ajv = new Ajv({logger});
    const areValidArguments = ajv.validate(
      {
        type: 'object',
        required: ['amount', 'type'],
        properties: {
          amount: Debt.validation.amountSchema,
          type: Debt.validation.typeSchema,
        },
      },
      req.body
    );

    if (!areValidArguments) {
      logger.log('info', 'Invalid arguments', {args: req.body});
      return Errors.sendApiError(res, Errors.API.BAD_REQUEST);
    }

    return res.status(200).json({
      result: true,
    });
  };

module.exports = AddDebt;
