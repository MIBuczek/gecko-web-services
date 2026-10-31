const FIREBASE = /^(?:@firebase\/|firebase(?:\/|$))/;

module.exports = (request, options) => {
  if (FIREBASE.test(request)) {
    return options.defaultResolver(request, {
      ...options,
      conditions: ['browser', 'require', 'default'],
    });
  }
  return options.defaultResolver(request, options);
};
