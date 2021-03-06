const Debt = require('../../modules/debt');
const Shared = require('../../modules/shared');

const ListDebts = () =>
  async function ListDebts(req, res) {
    let {page, page_size} = req.params;
    const {id: accountId} = req.user;

    page = Shared.isNumber(+page) ? +page : 1;
    const pageSize = Shared.isNumber(+page_size) ? +page_size : 1;

    const debtList = await Debt.functions.listDebts({
      accountId,
      page,
      pageSize,
    });

    const parsedRows = debtList.rows.map(debt => {
      delete debt.account_id;

      return debt;
    });

    return res.status(200).json({
      count: debtList.count,
      page,
      pageSize,
      result: parsedRows,
    });
  };

module.exports = ListDebts;
