(function(){
var Boot = window.Boot = {};
Boot.cssFiles = ['leisureCSS-e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.css'];
Boot.jsFiles = ['leisureJS-bdcc66395036534542dfb674b8756c24b106287bd20fd6d76e37e90427d7ac1a.js'];
})();
// Generated by CoffeeScript 1.6.2
/*
# put this in your browser and it boots the leisure envioronment
*/


(function() {
  var Boot, Leisure, addLoadToDocument, bootFuncs, bootLeisure, bootLeisureCont, booted, callPrepCode, finishBoot, handleError, loadThen, uniquify, _ref, _ref1,
    __slice = [].slice;

  Leisure = (_ref = window.Leisure) != null ? _ref : (window.Leisure = {});

  Boot = (_ref1 = window.Boot) != null ? _ref1 : (window.Boot = {});

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
      var load, oldParams, params, state, uri, _ref2;

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
        _ref2 = uri.getFragParams(), load = _ref2.load, state = _ref2.state;
        if (state) {
          document.querySelector('[maindoc]').innerHTML = "<h1>LOADING Google Drive file... </h1>";
        } else if (load) {
          document.querySelector('[maindoc]').innerHTML = "<h1>LOADING " + load + "... </h1>";
        }
        Boot.documentFragment = uri.fragment;
        document.location.hash = '';
        return bootLeisureCont(load, state);
      }
    });
  };

  uniquify = function(str) {
    return "" + str + "?uniq=" + (new Date().getTime());
  };

  bootLeisureCont = function(load, state) {
    var body, f, i, pre, style, _i, _len, _ref2;

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
    _ref2 = Boot.cssFiles;
    for (_i = 0, _len = _ref2.length; _i < _len; _i++) {
      i = _ref2[_i];
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
      load = new URI(document.location.href, load);
      console.log("LOADING " + load);
      return Prim.read(load, (function(data) {
        Notebook.replaceContents(load, data);
        return cont();
      }), function(err, html) {
        if (html) {
          return $('[maindoc]').html(html);
        } else {
          return $('[maindoc]').html("<h1>ERROR LOADING " + load + ": " + err + "</h1>");
        }
      });
    } : function(cont) {
      Notebook.replaceContents();
      return cont();
    };
    return loadThen(Boot.jsFiles, function() {
      Notebook.bootNotebook();
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
    console.log("Finished initializing storage");
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

  window.Leisure = Leisure;

  Leisure.bootLeisure = bootLeisure;

  Boot.loadThen = loadThen;

  Boot.addLoadToDocument = addLoadToDocument;

}).call(this);

/*
//@ sourceMappingURL=bootLeisure.map
*/
