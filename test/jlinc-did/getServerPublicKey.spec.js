'use strict';

const withDidServer = require('../helpers/withDidServer');
const withSinon = require('../helpers/withSinon');

describe('jlincDid.getServerPublicKey', function() {
  withDidServer();
  withSinon();

  it('should request and cache the servers public key', async function(){
    this.sinon.spy(this.didClient, 'request');
    expect( await this.didClient.getServerPublicKey() ).to.equal(this.SERVER_PUBLIC_KEY);
    expect(this.didClient.request).to.have.been.calledOnce;
    expect(this.didClient.request).to.have.been.calledWith({ method: 'get', path: '/' });
    expect( await this.didClient.getServerPublicKey() ).to.equal(this.SERVER_PUBLIC_KEY);
    expect(this.didClient.request).to.have.been.calledOnce;
  });

});
