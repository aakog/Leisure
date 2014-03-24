(function(){
var Boot = (window.Boot ? window.Boot : window.Boot = {});
Boot.cssFiles = ['leisureCSS-9682bba75201ee479429d891ac6eafbc5959f6a7.css'];
Boot.jsFiles = ['leisureJS-a86c911252613756ca441d14e48a78b56645e3b0.js'];
})();
// Generated by CoffeeScript 1.7.1

/*
 * put this in your browser and it boots the leisure envioronment
 */

(function() {
  var Boot, Leisure, addLoadToDocument, baseJsFiles, bootCalc, bootFuncs, bootLeisure, bootLeisureCont, bootNotebook, booted, callPrepCode, f, finishBoot, handleError, loadThen, oldRequire, reqGuard, uniquify, _ref, _ref1, _ref2, _ref3,
    __slice = [].slice;

  Leisure = (_ref = window.Leisure) != null ? _ref : (window.Leisure = {});

  Boot = (_ref1 = window.Boot) != null ? _ref1 : (window.Boot = {});

  window.module = {
    exports: Leisure
  };

  baseJsFiles = ['base', 'ast', 'runtime', 'gen', 'generatedPrelude', 'std', 'browserSupport', 'svg'];

  (_ref2 = Boot.jsFiles).push.apply(_ref2, (function() {
    var _i, _len, _results;
    _results = [];
    for (_i = 0, _len = baseJsFiles.length; _i < _len; _i++) {
      f = baseJsFiles[_i];
      _results.push("" + f + ".js");
    }
    return _results;
  })());

  if (Boot.extraJsFiles != null) {
    (_ref3 = Boot.jsFiles).push.apply(_ref3, (function() {
      var _i, _len, _ref3, _results;
      _ref3 = Boot.extraJsFiles;
      _results = [];
      for (_i = 0, _len = _ref3.length; _i < _len; _i++) {
        f = _ref3[_i];
        _results.push("" + f + ".js");
      }
      return _results;
    })());
  }

  reqGuard = false;

  if (typeof global !== "undefined" && global !== null) {
    Leisure = global.Leisure = window.Leisure = require('./base');
    Leisure.calc = true;
    window.realGlobal = global;
    oldRequire = global.require;
    window.require = function(file) {
      var err;
      if (reqGuard) {
        return Leisure;
      } else {
        try {
          if (name === 'nw.gui') {
            return nwDispatcher.requireNwGui();
          } else {
            return oldRequire(file);
          }
        } catch (_error) {
          err = _error;
          try {
            reqGuard = true;
            return Leisure.require(file);
          } finally {
            reqGuard = false;
          }
        }
      }
    };
  } else {
    window.require = function(file) {
      if (reqGuard) {
        return Leisure;
      } else {
        reqGuard = true;
        try {
          return Leisure.require(file);
        } finally {
          reqGuard = false;
        }
      }
    };
  }

  window.global = window;

  booted = false;

  bootFuncs = [];

  Boot.onboot = function(cont) {
    if (booted) {
      return cont();
    } else {
      return bootFuncs.push(cont);
    }
  };

  bootLeisure = function() {
    return loadThen([uniquify("uri.js")], function() {
      var load, oldParams, params, state, uri, _ref4;
      uri = new window.URI(document.location.href);
      oldParams = uri.getSearchParams();
      params = uri.getSearchParams();
      if (!params.uniq) {
        uri.appendSearch("uniq=" + (Math.random()));
      }
      if (params.state) {
        uri.appendFragment(uri.search.substring(1));
        uri.search = null;
      }
      if (oldParams.state || !oldParams.uniq) {
        return document.location.href = uri.toString();
      } else {
        _ref4 = uri.getFragParams(), load = _ref4.load, state = _ref4.state;
        if (Leisure.calc) {
          return bootCalc(uri, load, state);
        } else {
          return bootNotebook(uri, load, state);
        }
      }
    });
  };

  bootCalc = function(uri, load, state) {
    console.log("BOOTING CALC");
    return loadThen(Boot.jsFiles, function() {
      console.log("LOADED: " + Boot.jsFiles);
      return finishBoot();
    });
  };

  bootNotebook = function(uri, load, state) {
    if (state) {
      document.querySelector('[maindoc]').innerHTML = "<h1>LOADING Google Drive file... </h1>";
    } else if (load) {
      document.querySelector('[maindoc]').innerHTML = "<h1>LOADING " + load + "... </h1>";
    }
    Boot.documentFragment = uri.fragment;
    document.location.hash = '';
    return bootLeisureCont(load, state);
  };

  uniquify = function(str) {
    return "" + str + "?uniq=" + (new Date().getTime());
  };

  bootLeisureCont = function(load, state) {
    var body, i, pre, style, _i, _len, _ref4;
    window.removeEventListener('load', bootLeisure);
    body = document.body;
    if ('code' === body.getAttribute('leisureNode')) {
      pre = document.createElement('pre');
      pre.setAttribute('leisureNode', 'code');
      pre.setAttribute('contentEditable', 'true');
      pre.innerHTML = body.innerHTML;
      while (body.firstChild) {
        body.removeChild(body.firstChild);
      }
      body.appendChild(pre);
      body.removeAttribute('leisureNode');
    }
    _ref4 = Boot.cssFiles;
    for (_i = 0, _len = _ref4.length; _i < _len; _i++) {
      i = _ref4[_i];
      style = document.createElement('link');
      style.setAttribute('type', "text/css");
      style.setAttribute('rel', "stylesheet");
      style.setAttribute('href', i);
      document.head.appendChild(style);
    }
    f = state ? function(cont) {
      return window.GdriveStorage.openFromGdrive(cont);
    } : load ? function(cont) {
      addLoadToDocument(load);
      return window.Leisure.readFile(load, function(err, data) {
        var _ref5;
        if (!err) {
          if ((_ref5 = window.Notebook) != null) {
            _ref5.replaceContents(load, data);
          }
          return cont();
        } else if (data) {
          return $('[maindoc]').html(data);
        } else {
          return $('[maindoc]').html("<h1>ERROR LOADING " + load + ": " + err + "</h1>");
        }
      });
    } : function(cont) {
      var _ref5;
      if ((_ref5 = window.Notebook) != null) {
        _ref5.replaceContents();
      }
      return cont();
    };
    return loadThen(Boot.jsFiles, function() {
      var _ref5;
      if ((_ref5 = window.Notebook) != null) {
        _ref5.bootNotebook();
      }
      return f(function() {
        if (typeof window.leisureFirst === "function") {
          window.leisureFirst();
        }
        if (window.leisurePrep != null) {
          return callPrepCode(window.leisurePrep, 0, finishBoot);
        } else {
          return finishBoot();
        }
      });
    });
  };

  addLoadToDocument = function(uri) {
    var p, u;
    u = new URI(document.location.href);
    p = u.getFragParams();
    p.load = uri.toString();
    u.setFragParams(p);
    return document.location.href = u.toString();
  };

  callPrepCode = function(preps, index, finishBoot) {
    if (index < preps.length) {
      return ReplCore.processLine(preps[index], Prim.defaultEnv, 'Parse.', function() {
        return callPrepCode(preps, index + 1, finishBoot);
      });
    } else {
      return finishBoot();
    }
  };

  finishBoot = function() {
    if (window.leisureBoot != null) {
      bootFuncs.push(window.leisureBoot);
    }
    while (bootFuncs.length) {
      bootFuncs.shift()();
    }
    return booted = true;
  };

  loadThen = function(files, cont, index) {
    var err, script;
    index = index != null ? index : 0;
    if (index === files.length) {
      return typeof cont === "function" ? cont() : void 0;
    } else {
      if (!files[index]) {
        err = new Error("NO FILE AT INDEX " + index + " in " + (JSON.stringify(files)));
        console.log(err.stack);
        throw err;
      }
      script = document.createElement('script');
      script.setAttribute('src', files[index]);
      script.addEventListener('load', function() {
        return loadThen(files, cont, index + 1);
      });
      return document.head.appendChild(script);
    }
  };

  if (document.readyState === 'complete') {
    bootLeisure();
  } else {
    window.addEventListener('load', bootLeisure);
  }

  handleError = function() {
    var args;
    args = 1 <= arguments.length ? __slice.call(arguments, 0) : [];
    return function(e) {
      return console.log.apply(console, ['Error: '].concat(__slice.call(args), [e]));
    };
  };

  Leisure.bootLeisure = bootLeisure;

  Boot.loadThen = loadThen;

  Boot.addLoadToDocument = addLoadToDocument;

}).call(this);

//# sourceMappingURL=bootLeisure.map
