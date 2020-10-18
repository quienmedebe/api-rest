async function handleError(err, {logger}) {
  logger.log('error', err.message, {name: err.name, stack: err.stack});

  if (['development', 'test'].includes(process.env.NODE_ENV)) {
    console.log(err.stack);
  }

  return;
}

module.exports = handleError;
