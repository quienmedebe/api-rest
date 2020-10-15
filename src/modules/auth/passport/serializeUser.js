const serializeUser = ({id, ...account}) => {
  return {
    id: +id,
    ...account,
  };
};

module.exports = serializeUser;
