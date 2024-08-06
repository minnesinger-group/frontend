const nodes = require('stylus/lib/nodes');

const math = function() {
  return function(style) {
    style.define('sqrt', function(value) {
      return new nodes.Unit(Math.sqrt(value.val), value.type);
    });
  };
};
module.exports = math;
