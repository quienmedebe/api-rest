const Debt = require('../../modules/debt');

const DebtsBalance = () =>
  async function DebtsBalance(req, res) {
    const {id: accountId} = req.user;

    const debtsBalance = await Debt.functions.getAccountBalance({
      accountId,
    });

    return res.status(200).json({
      result: debtsBalance,
    });
  };

module.exports = DebtsBalance;
