async function handleError(err, {logger}) {
  logger.error(err.message, {name: err.name, stack: err.stack, err});

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    console.error(err.stack);
  }

  return;
}

module.exports = handleError;
