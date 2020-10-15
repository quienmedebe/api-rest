async function handleError(err, {logger}) {
  logger.log('error', err.message, {name: err.name, stack: err.stack});
  return;
}

module.exports = handleError;
