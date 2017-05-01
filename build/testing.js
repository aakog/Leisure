// Generated by CoffeeScript 1.10.0
(function() {
  define([], function() {
    var assert, assertEq, strFunc;
    strFunc = function(str) {
      if (typeof str === 'function') {
        return str;
      } else {
        return function() {
          return str;
        };
      }
    };
    assert = function(errStr, bool) {
      if (!bool) {
        throw new Error(strFunc(errStr)());
      }
    };
    assertEq = function(errStr, a, b) {
      return assert((function() {
        return strFunc(errStr)(a, b);
      }), _.isEqual(a, b));
    };
    return {
      assert: assert,
      assertEq: assertEq
    };
  });

}).call(this);

//# sourceMappingURL=testing.js.map
