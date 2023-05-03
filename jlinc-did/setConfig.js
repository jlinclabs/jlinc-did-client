'use strict';

const config = require('./config');

module.exports = function (_config) {
  for (const key in _config)
    config[key] = _config[key];
};
