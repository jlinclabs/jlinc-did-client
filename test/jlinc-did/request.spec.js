'use strict';

const request = require('request-promise');

const withSinon = require('../helpers/withSinon');
const { DidClient } = require('../..');

describe('jlincDid.request', function() {
  withSinon();

  context('when missing required arguments', function(){
    it('should throw an error', async function(){
      await expect(
        DidClient.request({})
      ).to.be.rejectedWith('method is required');

      await expect(
        DidClient.request({ method: 'get' })
      ).to.be.rejectedWith('path is required');
    });
  });

  context('when didServerUrl is not set', function(){
    beforeEach(function(){
      delete DidClient.getConfig().didServerUrl;
    });
    it('should throw an error', async function(){
      await expect(
        DidClient.request({
          method: 'get',
          path: '/',
        })
      ).to.be.rejectedWith('You must set didServerUrl');
    });
  });

  context('when didServerUrl is set', function(){
    beforeEach(function(){
      DidClient.setConfig({didServerUrl: 'http://example.com/'});
    });

    context('when method is invalid', function(){
      it('should throw an error', async function(){
        await expect(
          DidClient.request({
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
        await DidClient.request({
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
        DidClient.setConfig({didServerUrl: 'https://fark.com/'});
        const response = await DidClient.request({
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
        DidClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(DidClient.RequestError, 'RequestError: "there be dragons arrrrr"');

      request.get.resolves({
        statusCode: 400,
        body: null
      });
      await expect(
        DidClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(DidClient.RequestError, 'RequestError: "statusCode=400 method=get path=/"');

    });
  });

  context('when the server responds with a 404', function(){
    it('should throw a ResourceNotFoundErro', async function(){
      this.sinon.stub(request, 'get');

      request.get.resolves({ statusCode: 404 });
      await expect(
        DidClient.request({ method: 'get', path: '/' })
      ).to.be.rejectedWith(DidClient.ResourceNotFoundErro, 'Resource Not Found: method=get path=/');

    });
  });
});
