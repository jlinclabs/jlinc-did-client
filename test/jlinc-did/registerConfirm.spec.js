'use strict';

const withDidServer = require('../helpers/withDidServer');

describe('jlincDid.registerConfirm', function() {
  withDidServer();

  context('when given an entity that does not match the challenge', function(){
    it('should throw an error');
  });
});
