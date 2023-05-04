'use strict';

const net = require('net');

const findOpenPort = function(){
  return new Promise(resolve => {
    var server = net.createServer(function(sock) {
      sock.end('Port Finder\n');
    });
    server.listen(0, function() {
      resolve(server.address().port);
      server.close();
    });
  });
};

module.exports = findOpenPort;
