module.exports = function (options) {
  options.watchOptions = {
    poll: 1000,
    aggregateTimeout: 300,
  };

  return options;
};
