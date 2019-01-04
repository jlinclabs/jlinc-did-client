// 'use strict';

// const withDidServer = require('../helpers/withDidServer');

// describe('superseding a DID', function() {
//   withDidServer();

//   context('with an invalid DID id', function () {
//     it('should respond with 404', async function () {
//       // const response = await this.didClient.supersedeRequest('did:jlinc:xxxxxxxxxxxxxxxf4k31337k3yxxxxxxxxxxxxxxxx');
//       // expect(response.success).to.be.false;
//       // expect(response.status).to.equal(400);
//       // expect(response.entity).to.be.aDidEntity();
//     });
//   });

//   context('with a valid DID id', function () {
//     beforeEach(async function(){
//       Object.assign(this, await this.registerDid());
//     });

//     it('supersede a DID', async function() {
//       const response = await this.didClient.supersedeRequest(this.didId);
//       expect(response.success).to.be.true;
//       expect(response.status).to.equal(200);
//       const { entity, confirmable } = response;
//       expect(entity).to.be.aDidEntity();
//       expect(confirmable.challenge).to.be.aRegistrationSecret();
//       expect(confirmable.id).to.be.aDid();

//       expect(
//         await this.didClient.supersedeConfirm(entity, confirmable, this.entity.registrationSecret)
//       ).to.matchPattern({
//         success: true,
//         id: confirmable.id,
//       });
//     });
//   });

// });
