function _notImplemented(name, isPromise) {
  return () => {
    const errorMessage = `${name} method not implemented`;
    if (isPromise) {
      return Promise.reject(errorMessage);
    }

    throw new Error(errorMessage);
  };
}

module.exports = _notImplemented;
