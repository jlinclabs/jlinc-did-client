'use strict';

const { spawn } = require('child_process');

describe('lint', function(){
  it('should have no errors or warnings', function(done) {
    this.timeout(30000);
    const linter = spawn('./scripts/lint');

    let stdout;
    linter.stdout.on('data', (chunk) => {
      stdout += chunk;
    });
    let stderr;
    linter.stderr.on('data', (chunk) => {
      stderr += chunk;
    });

    linter.on('close', (code) => {
      if (code === 0) { return done(); }
      done(new Error(`linter failed\n\n${stdout}\n\n${stderr}`));
    });
  });
});
