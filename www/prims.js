// Generated by CoffeeScript 1.6.2
(function() {
  var URI;

  URI = require('./uri');

  define('read', function() {
    return function(uri) {
      return makeMonad(function(env, cont) {
        return read(new URI(uri()), (function(data) {
          return cont(_left()(laz(data.toString())));
        }), function(err) {
          return cont(_right()(laz(err.stack.toString())));
        });
      });
    };
  });

  define('write', function() {
    return function(uri) {
      return function(data) {
        return makeMonad(function(env, cont) {
          return write(new URI(uri()), data(), (function() {
            return cont(_left()(laz("success")));
          }), function(err) {
            return cont(_right()(laz(err.stack.toString())));
          });
        });
      };
    };
  });

  define('forward', function() {
    return function(name) {
      return makeMonad(function(env, cont) {
        Leisure.defineForward(name);
        return cont(_false());
      });
    };
  });

}).call(this);

/*
//@ sourceMappingURL=prims.map
*/
