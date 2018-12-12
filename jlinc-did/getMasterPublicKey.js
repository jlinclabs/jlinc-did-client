/* eslint no-console: 0 */

'use strict';

const request = require('request');

module.exports = function getMasterPublicKey(callback) {
  if (process.env.masterPublicKey) {
    return callback(process.env.masterPublicKey);
  } else {
    let url = this.Conf.didServerUrl;
    request(url, function (error, response, body) {
      console.log('error:', error); // Print the error if one occurred
      console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
      console.log('body:', JSON.parse(body).masterPublicKey); // Print the HTML for the Google homepage.
    });
    return callback(process.env.masterPublicKey);
  }
};
