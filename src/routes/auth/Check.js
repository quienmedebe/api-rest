const Check = () =>
  async function Check(req, res) {
    const user = {
      ...req.user,
    };

    user.id = user.public_id;
    delete user.public_id;

    return res.status(200).json(user);
  };

module.exports = Check;
