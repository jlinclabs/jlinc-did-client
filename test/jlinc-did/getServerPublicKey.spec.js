'use strict';

const withDidServer = require('../helpers/withDidServer');
const withSinon = require('../helpers/withSinon');

describe('jlincDid.getServerPublicKey', function() {
  withDidServer();
  withSinon();

  it('should request and cache the servers public key', async function(){
    this.sinon.spy(this.DidClient, 'request');
    expect( await this.DidClient.getServerPublicKey() ).to.equal(this.SERVER_PUBLIC_KEY);
    expect(this.DidClient.request).to.have.been.calledOnce;
    expect(this.DidClient.request).to.have.been.calledWith({ method: 'get', path: '/' });
    expect( await this.DidClient.getServerPublicKey() ).to.equal(this.SERVER_PUBLIC_KEY);
    expect(this.DidClient.request).to.have.been.calledOnce;
  });

});
