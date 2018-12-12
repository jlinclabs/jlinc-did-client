'use strict';

const request = require('request-promise');

// wrap all the request-promise HTTP Method functions
// so we have a single function that all HTTP request
// go through so we can stub them in test

module.exports.get = request.get;
module.exports.head = request.head;
module.exports.options = request.options;
module.exports.post = request.post;
module.exports.put = request.put;
module.exports.patch = request.patch;
module.exports.delete = request.delete;
