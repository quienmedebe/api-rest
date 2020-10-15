const Check = () =>
  async function Check(req, res) {
    return res.status(200).json(req.user);
  };

module.exports = Check;
