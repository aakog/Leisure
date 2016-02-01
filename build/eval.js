// Generated by CoffeeScript 1.10.0
(function() {
  var slice = [].slice,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./base', './ast', './runtime', 'acorn', 'acorn_walk', './lib/lispyscript/browser-bundle', './coffee-script', 'lib/bluebird.min', './gen', './export'], function(Base, Ast, Runtime, Acorn, AcornWalk, LispyScript, CS, Bluebird, Gen, Exports) {
    var Html, Nil, Node, Promise, _true, acorn, acornLoose, acornWalk, blockVars, c, cons, csEnv, defaultEnv, e, errorDiv, escapeHtml, escapeString, escaped, evalLeisure, findError, genSource, getLeft, getLeisurePromise, getRight, getType, getValue, handleErrors, html, id, isError, jsEnv, jsEval, jsonConvert, knownLanguages, languageEnvMaker, lazy, lc, leisureEnv, leisureExec, leisurePromise, lispyScript, localEval, lsEnv, lz, makeHamt, makeSyncMonad, mergeExports, newConsFrom, presentHtml, replacements, requirePromise, resolve, runMonad, runMonad2, runNextResult, rz, setLounge, setValue, show, simpleEval, slashed, specials, unescapePresentationHtml, unescapeString, unescaped, walk, writeValues;
    acorn = Acorn;
    acornWalk = AcornWalk;
    acornLoose = null;
    setTimeout((function() {
      return require(['acorn_loose'], function(AcornLoose) {
        return acornLoose = AcornLoose;
      });
    }), 1);
    lispyScript = lsrequire("lispyscript");
    getType = Ast.getType, cons = Ast.cons, unescapePresentationHtml = Ast.unescapePresentationHtml, Nil = Ast.Nil;
    mergeExports = Exports.mergeExports;
    Node = Base.Node, resolve = Base.resolve, lazy = Base.lazy, defaultEnv = Base.defaultEnv;
    window.resolve = rz = resolve;
    window.lazy = lz = lazy;
    lc = Leisure_call;
    runMonad = Runtime.runMonad, runMonad2 = Runtime.runMonad2, newConsFrom = Runtime.newConsFrom, setValue = Runtime.setValue, getValue = Runtime.getValue, makeSyncMonad = Runtime.makeSyncMonad, makeHamt = Runtime.makeHamt, _true = Runtime._true, jsonConvert = Runtime.jsonConvert, getLeisurePromise = Runtime.getLeisurePromise;
    Promise = Bluebird.Promise;
    genSource = Gen.genSource;
    defaultEnv.prompt = function(str, defaultValue, cont) {
      return cont(prompt(str, defaultValue));
    };
    requirePromise = function() {
      var file;
      file = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      return new Promise(function(resolve, reject) {
        return require(file, resolve);
      });
    };
    leisurePromise = null;
    getLeisurePromise = function() {
      if (!leisurePromise) {
        leisurePromise = requirePromise('./leisure/generatedPrelude').then(function() {
          return requirePromise('./leisure/std');
        }).then(function() {
          return requirePromise('./leisure/parseAst');
        }).then(function() {
          return requirePromise('./leisure/svg');
        }).then(function() {
          return new Promise(function(resolve, reject) {
            return simpleEval('resetStdTokenPacks', resolve, reject);
          });
        });
      }
      return leisurePromise;
    };
    simpleEval = function(txt, success, fail) {
      var env, rejected;
      rejected = false;
      env = {
        __proto__: defaultEnv,
        errorAt: function(offset, msg) {
          if (!rejected) {
            rejected = true;
            return fail(msg);
          }
        }
      };
      return runMonad2(rz(L_newParseLine)(0, L_nil, txt), env, function(ast) {
        var err, error;
        if (getType(ast) !== 'err') {
          try {
            return runMonad2(eval(genSource(txt, ast)), env, function(x) {
              if (!rejected) {
                return success(x);
              }
            });
          } catch (error) {
            err = error;
            if (!rejected) {
              return fail(err);
            }
          }
        } else if (!rejected) {
          return fail(new Error("Parse error: " + (ast(id))));
        }
      });
    };
    defaultEnv.write = function(str) {
      return console.log(str);
    };
    defaultEnv.errorAt = function(offset, msg) {
      return console.log(msg);
    };
    id = lz(function(x) {
      return rz(x);
    });
    getLeft = function(x) {
      return x(id)(id);
    };
    getRight = function(x) {
      return x(id)(id);
    };
    show = function(obj) {
      if (typeof L_show !== "undefined" && L_show !== null) {
        return rz(L_show)(lz(obj));
      } else {
        return console.log(obj);
      }
    };
    window.evalLeisure = evalLeisure = function(str, cont) {
      var env;
      env = leisureEnv({
        __proto__: defaultEnv
      });
      env.presentValue = function(v) {
        return v;
      };
      return env.executeText(str, Nil, cont);
    };
    leisureEnv = function(env) {
      env.presentValue = function(v) {
        return html(rz(L_showHtml)(lz(v)));
      };
      env.executeText = function(text, props, cont) {
        var opts;
        if (!cont) {
          cont = function(x) {
            var r;
            r = x.head().tail();
            if (getType(r) === 'left') {
              return new Error(getLeft(r));
            } else {
              return getRight(r);
            }
          };
        }
        if (getLeisurePromise().isResolved()) {
          return leisureExec(env, text, props, cont, (function(_this) {
            return function(err) {
              var ref;
              return _this.errorAt(0, (ref = err != null ? err.message : void 0) != null ? ref : err);
            };
          })(this));
        } else {
          if (opts = env.opts) {
            console.log("OPTS:", opts);
          }
          return getLeisurePromise().then(((function(_this) {
            return function() {
              if (!env.opts) {
                env.opts = opts;
              }
              return leisureExec(env, text, props, cont, function(err) {
                var ref;
                return _this.errorAt(0, (ref = err != null ? err.message : void 0) != null ? ref : err);
              });
            };
          })(this)), (function(_this) {
            return function(err) {
              var ref;
              return _this.errorAt(0, (ref = err != null ? err.message : void 0) != null ? ref : err);
            };
          })(this));
        }
      };
      return env;
    };
    leisureExec = function(env, text, props, cont, errCont) {
      var err, error, old;
      try {
        old = getValue('parser_funcProps');
        setValue('parser_funcProps', props);
        return setLounge(env, function() {
          var result;
          result = rz(L_baseLoadString)('notebook', text);
          return runMonad2(result, env, function(results) {
            return runNextResult(results, env, (function() {
              setValue('parser_funcProps', old);
              return (cont != null ? cont : function(x) {
                return x;
              })(results);
            }), errCont);
          });
        });
      } catch (error) {
        err = error;
        return errCont(err);
      }
    };
    runNextResult = function(results, env, cont, errCont) {
      var async, err, error, sync;
      while (results !== rz(L_nil)) {
        if (getType(results.head().tail()) === 'left') {
          env.write("PARSE ERROR: " + (getLeft(results.head().tail())));
        } else {
          sync = true;
          async = true;
          try {
            setLounge(env, function() {
              return runMonad2(getRight(results.head().tail()), env, function(res2) {
                if (getType(res2) !== 'unit') {
                  env.write(env.presentValue(res2));
                }
                if (sync) {
                  return async = false;
                } else {
                  return runNextResult(results.tail(), env, cont, errCont);
                }
              });
            });
          } catch (error) {
            err = error;
            errCont(err);
          }
          sync = false;
          if (async) {
            return;
          }
        }
        results = results.tail();
      }
      return cont();
    };
    presentHtml = function(v) {
      var str;
      str = ': ' + (v instanceof Html ? v.content.replace(/\r?\n/g, '\\n') : escapeHtml(String(v).replace(/\r?\n/g, '\n: ')));
      if (_.last(str) === '\n') {
        return str;
      } else {
        return str + '\n';
      }
    };
    writeValues = function(env, values) {
      return env.write(values.join('\n'));
    };
    setLounge = function(env, func) {
      var result;
      window.Lounge = env;
      env.opts = env.opts;
      result = func();
      window.Lounge = null;
      return result;
    };
    jsEnv = function(env) {
      env.executeText = function(text, props, cont) {
        var err, error, value;
        try {
          writeValues(env, value = jsEval(env, text));
        } catch (error) {
          err = error;
          this.errorAt(0, err.message);
        }
        return typeof cont === "function" ? cont(value) : void 0;
      };
      return env;
    };
    jsEval = function(env, text) {
      var console, err, err2, errNode, error, error1, expr, exprText, i, len, newText, parsed, ref;
      try {
        parsed = acorn.parse(text);
      } catch (error) {
        err = error;
        errNode = null;
        handleErrors(acornLoose.parse_dammit(text), function(node) {
          return errNode = node;
        });
        try {
          setLounge(env, function() {
            return eval(text);
          });
        } catch (error1) {
          err2 = error1;
          if (errNode) {
            env.errorAt(Math.min(errNode.start, errNode.end), err2.message);
          } else {
            env.errorAt(findError(err.message, text), err2.message);
          }
          return [];
        }
      }
      if (!env.silent) {
        env.results = [];
        newText = 'var leisure_results=[];';
      }
      ref = parsed.body;
      for (i = 0, len = ref.length; i < len; i++) {
        expr = ref[i];
        if (expr.type === 'ExpressionStatement') {
          exprText = text.substring(expr.start, expr.end);
          if (exprText[exprText.length - 1] === ';') {
            exprText = exprText.substring(0, exprText.length - 1);
          }
          if (!env.silent) {
            newText += "leisure_results.push(" + exprText + ");";
          }
        } else {
          newText += text.substring(expr.start, expr.end);
        }
      }
      if (!env.silent) {
        newText += ";leisure_results;";
      }
      console = {
        log: (function(_this) {
          return function(str) {
            return env.write(env.presentValue(str));
          };
        })(this)
      };
      return setLounge(env, function() {
        var ref1;
        return ((ref1 = env["eval"]) != null ? ref1 : localEval)(newText);
      });
    };
    findError = function(err, text) {
      var col, i, len, line, n, ref, ref1, tot, txt, x;
      ref = err.match(/\(([0-9]*):([0-9]*)\)/), x = ref[0], line = ref[1], col = ref[2];
      line = Number(line - 1);
      tot = Number(col);
      ref1 = text.split('\n');
      for (n = i = 0, len = ref1.length; i < len; n = ++i) {
        txt = ref1[n];
        if (n === line) {
          break;
        } else {
          tot += txt.length + 1;
        }
      }
      return tot;
    };
    walk = window.Walk = function(node, func) {
      var type, v;
      v = {};
      for (type in acornWalk.base) {
        v[type] = func;
      }
      return acornWalk.simple(node, v, null);
    };
    isError = function(node) {
      return node.name === "✖";
    };
    handleErrors = function(ast, func) {
      return walk(ast, function(node) {
        if (isError(node)) {
          return func(node);
        }
      });
    };
    lsEnv = function(env) {
      env.executeText = function(text, props, cont) {
        var console, err, error, value;
        try {
          console = {
            log: (function(_this) {
              return function(str) {
                return env.write(env.presentValue(str));
              };
            })(this)
          };
          value = setLounge(env, function() {
            return eval(lispyScript._compile(text));
          });
          if (typeof value !== 'undefined') {
            writeValues(env, [value]);
          }
        } catch (error) {
          err = error;
          this.errorAt(0, err.message);
        }
        return typeof cont === "function" ? cont(value) : void 0;
      };
      return env;
    };
    csEnv = function(env) {
      env.executeText = function(text, props, cont) {
        var err, error, values;
        try {
          writeValues(env, values = jsEval(env, CS.compile(text, {
            bare: true
          })));
        } catch (error) {
          err = error;
          this.errorAt(0, err.message);
        }
        return typeof cont === "function" ? cont(values) : void 0;
      };
      return env;
    };
    Html = (function() {
      function Html(content) {
        this.content = String(content);
      }

      return Html;

    })();
    html = function(content) {
      return new Html(content);
    };
    errorDiv = function(err, orgText) {
      return "<span class='error' contenteditable='false'><span class='hidden'>" + (orgText || '') + "</span><span data-nonorg='true'>" + (escapeHtml(err)) + "</span></span>";
    };
    replacements = {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
      "'": '&#39;'
    };
    escapeHtml = function(str) {
      if (typeof str === 'string') {
        return str.replace(/[<>&'"]/g, function(c) {
          return replacements[c];
        });
      } else {
        return str;
      }
    };
    knownLanguages = {
      leisure: leisureEnv,
      javascript: jsEnv,
      js: jsEnv,
      lisp: lsEnv,
      cs: csEnv,
      coffee: csEnv,
      coffeescript: csEnv
    };
    localEval = (function(html) {
      return function(x) {
        return eval(x);
      };
    })(html);
    languageEnvMaker = function(name) {
      return knownLanguages[name != null ? name.toLowerCase() : void 0];
    };
    blockVars = function(data, varDefs) {
      var bl, blockIds, eq, i, len, ref, ref1, v, value, vars;
      blockIds = {};
      vars = {};
      if (varDefs) {
        ref = (_.isArray(varDefs) ? varDefs : [varDefs]);
        for (i = 0, len = ref.length; i < len; i++) {
          v = ref[i];
          if ((eq = v.indexOf('=')) > 0) {
            value = v.substring(eq + 1).trim();
            if (ref1 = value[0], indexOf.call("'\"0123456789", ref1) >= 0) {
              value = JSON.parse(value);
            } else if (bl = data.getBlockNamed(value)) {
              blockIds[bl._id] = true;
              value = bl.yaml;
            } else {
              value = value.trim();
            }
            vars[v.substring(0, eq).trim()] = value;
          }
        }
      }
      return [vars, _.keys(blockIds)];
    };
    escaped = {
      '\b': "\\b",
      '\f': "\\f",
      '\n': "\\n",
      '\r': "\\r",
      '\t': "\\t",
      '\v': "\\v",
      '\"': "\\\"",
      '\\': "\\\\"
    };
    unescaped = _.zipObject((function() {
      var results1;
      results1 = [];
      for (c in escaped) {
        e = escaped[c];
        results1.push([e, c]);
      }
      return results1;
    })());
    specials = /[\b\f\n\r\t\v\"\\]/g;
    slashed = /\\./g;
    escapeString = function(str) {
      return String(str).replace(specials, function(c) {
        return escaped[c];
      });
    };
    unescapeString = function(str) {
      return String(str).replace(slashed, function(c) {
        var ref;
        return (ref = unescaped[c]) != null ? ref : c[1];
      });
    };
    mergeExports({
      evalLeisure: evalLeisure
    });
    return {
      languageEnvMaker: languageEnvMaker,
      html: html,
      Html: Html,
      escapeHtml: escapeHtml,
      blockVars: blockVars,
      knownLanguages: knownLanguages,
      presentHtml: presentHtml,
      escapeString: escapeString,
      unescapeString: unescapeString,
      evalLeisure: evalLeisure,
      setLounge: setLounge
    };
  });

}).call(this);

//# sourceMappingURL=eval.js.map
