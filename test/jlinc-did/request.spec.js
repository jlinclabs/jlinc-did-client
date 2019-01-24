'use strict';

const request = require('request-promise');

const withSinon = require('../helpers/withSinon');
const didClient = require('../../jlinc-did');

describe('jlincDid.request', function() {
  withSinon();

  context('when missing required arguments', function(){
    it('should throw an error', async function(){
      await expect(
        didClient.request({})
      ).to.be.rejectedWith('method is required');

      await expect(
        didClient.request({ method: 'get' })
      ).to.be.rejectedWith('path is required');
    });
  });

  context('when jlincDid.didServerUrl is not set', function(){
    beforeEach(function(){
      delete didClient.didServerUrl;
    });
    it('should throw an error', async function(){
      await expect(
        didClient.request({
          method: 'get',
          path: '/',
        })
      ).to.be.rejectedWith('jlincDidClient.didServerUrl must be set');
    });
  });

  context('when jlincDid.didServerUrl is set', function(){
    beforeEach(function(){
      didClient.didServerUrl = 'http://example.com/';
    });

    context('when method is invalid', function(){
      it('should throw an error', async function(){
        await expect(
          didClient.request({
            method: 'frog',
            path: '/',
          })
        ).to.be.rejectedWith('method is invalid');
      });
    });

    context('when method is valid', function(){
      it('should return the response body', async function(){
        this.sinon.stub(request, 'get').callsFake(() => {
          return {
            statusCode: 200,
            body: {
              this_is_the_body: 'yup',
            }
          };
        });
        await didClient.request({
          method: 'get',
          path: '/',
        });
        expect(request.get).to.have.been.calledOnce;
        expect(request.get).to.have.been.calledWith({
          method: 'get',
          url: 'http://example.com/',
          body: undefined,
          json: true,
          resolveWithFullResponse: true,
          simple: false,
          followRedirect: undefined,
        });

        // when there is no trailing slash
        didClient.didServerUrl = 'https://fark.com';
        const response = await didClient.request({
          method: 'get',
          path: '/foo/bar',
        });
        expect(request.get).to.have.been.calledTwice;
        expect(request.get).to.have.been.calledWith({
          method: 'get',
          url: 'https://fark.com/foo/bar',
          body: undefined,
          json: true,
          resolveWithFullResponse: true,
          simple: false,
          followRedirect: undefined,
        });
        expect(response).to.deep.equal({
          this_is_the_body: 'yup',
        });
      });
    });

  });

  context('when the server responds with an error', function(){
    it('should throw a RequestError', async function(){
      this.sinon.stub(request, 'get');

      request.get.resolves({
        statusCode: 400,
        body: {
          error: 'there be dragons arrrrr',
        }
      });
      await expect(
        didClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(didClient.RequestError, 'RequestError: there be dragons arrrrr');

      request.get.resolves({
        statusCode: 400,
        body: null
      });
      await expect(
        didClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(didClient.RequestError, 'RequestError: unknown request error statusCode: 400');

    });
  });

  context('when the server responds with a 404', function(){
    it('should throw a ResourceNotFoundErro', async function(){
      this.sinon.stub(request, 'get');

      request.get.resolves({ statusCode: 404 });
      await expect(
        didClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(didClient.ResourceNotFoundErro, 'request not found');

    });
  });
});
