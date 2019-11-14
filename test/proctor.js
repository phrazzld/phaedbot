// phaedbot/test/proctor.js
//
// Without requirements or design,
// programming is the art of adding bugs to an empty text file.

const expect = require('chai').expect;
const config = require('@root/config');

const check = err => {
  if (err) {
    console.error(err);
    expect(err).to.be.null;
  }
};

module.exports = {
  check,
};
