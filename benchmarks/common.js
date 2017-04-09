const fs = require('fs');
const path = require('path');
const common = require('../test/common');

const tests = [];

/**
 * Generate data that will be used for testing
 */
const tinyString = common.alphabet(12);
const smallString = common.alphabet(1E3);
const mediumString = common.alphabet(25E3);
const largeString = fs.readFileSync(path.join(__dirname, '../test/fixtures/lipsum.txt'));

const options = {
	minSamples: 200,
  	onComplete: runNext,
  	onError: function () {
  		console.log(arguments);
  	}
};

function runNext(bench) {
  bench && printInfo(bench);
  const test = tests.shift();
  if (test) {
    console.log(test.name);
    test.run();
  } else {
    process.exit();
  }
}

function printInfo(bench) {
  console.log("Executing benchmark:" + bench.target);
}

module.exports = {
	tinyString,
	smallString,
	mediumString,
	largeString,
	printInfo,
	runNext,
	options,
	tests
};
