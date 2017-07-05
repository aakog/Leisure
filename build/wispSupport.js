// Generated by CoffeeScript 1.10.0
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    slice = [].slice;

  define(['./eval', './docOrg', 'bluebird', './gen', 'immutable', './editor', './editorSupport', 'acorn', 'lodash', 'jquery'], function(Eval, DocOrg, Bluebird, Gen, Immutable, Editor, EditorSupport, Acorn, _, $) {
    var Compiler, Promise, Scope, SourceMapConsumer, SourceMapGenerator, SourceNode, Wisp, WispScope, atOrAfter, baseFindExports, blockSource, codeOffset, compile, dumpNodes, envFunc, findExports, findNs, jsCodeFor, lastExportLoc, lineColumnStrOffset, modules, parseIt, presentHtml, setLounge, sourceMapFromCode, translateIdentifierWord, wispCompile, wispEval, wispFileCounter, wispPromise, wispRequire, wp;
    setLounge = Eval.setLounge, parseIt = Eval.parseIt, Scope = Eval.Scope, lineColumnStrOffset = Eval.lineColumnStrOffset, presentHtml = Eval.presentHtml;
    blockSource = DocOrg.blockSource;
    Promise = Bluebird.Promise;
    SourceNode = Gen.SourceNode, SourceMapConsumer = Gen.SourceMapConsumer, SourceMapGenerator = Gen.SourceMapGenerator, jsCodeFor = Gen.jsCodeFor;
    Leisure.WispNS = {
      lounge: {
        tools: {}
      }
    };
    Wisp = null;
    wispCompile = null;
    wispFileCounter = 0;
    modules = {
      immutable: Immutable,
      "eval": Eval,
      "doc-org": DocOrg,
      editor: Editor,
      "editor-support": EditorSupport,
      lodash: _,
      jquery: $
    };
    WispScope = (function(superClass) {
      extend(WispScope, superClass);

      function WispScope(nsName) {
        WispScope.__super__.constructor.call(this);
        this._ns_ = {
          id: nsName
        };
        this.exports = {};
      }

      WispScope.prototype.wispEval = function(s) {
        try {
          Leisure.wispScope = this;
          return this["eval"](s);
        } finally {
          Leisure.wispScope = null;
        }
      };

      return WispScope;

    })(Scope);
    wispRequire = function(s, base) {
      s = new URL(s, 'http://x\/' + base.replace(/\./g, "\/")).pathname.replace(/^\//, '').replace(/\//g, '.');
      return _.get(modules, s) || findNs(s).exports;
    };
    findNs = function(nsName, create) {
      var scope;
      scope = _.get(Leisure.WispNS, nsName);
      if (!scope && create) {
        _.set(Leisure.WispNS, nsName, scope = new WispScope(nsName));
      }
      return scope;
    };
    wp = null;
    translateIdentifierWord = null;
    wispPromise = function() {
      return wp || (wp = new Promise(function(resolve, reject) {
        var req;
        req = window.require;
        window.require = null;
        return requirejs(['lib/wisp'], function(W) {
          var baseWispCompile, exports, newMacroDef;
          Leisure.Wisp = modules.wisp = Wisp = W;
          translateIdentifierWord = W.backend.escodegen.writer.translateIdentifierWord;
          baseWispCompile = Wisp.compiler.compile;
          window.require = req;
          wispCompile = function() {
            var args, node;
            args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
            node = baseWispCompile.apply(null, args);
            if (node.error) {
              throw node.error;
            }
            return node;
          };
          Leisure.wispCompilePrim = wispCompile;
          Leisure.wispCompileBase = baseWispCompile;
          exports = Leisure.WispNS.lounge.tools;
          newMacroDef = wispCompile("(defn expand-defmacro\n  \"Like defn, but the resulting function name is declared as a\n  macro and will be used as a macro by the compiler when it is\n  called.\"\n  [&form id & body]\n  (let [fn (with-meta `(defn ~id ~@body) (meta &form))\n        form `(do ~fn ~id)\n        ast (analyze form)\n        code (compile ast)\n        nsObj (or (and Leisure.wispScope Leisure.wispScope.*ns*) *ns*)\n        nsName (if nsObj (:id nsObj))\n        ns (or Leisure.wispScope (and *ns* (Leisure.wispFindNs nsName)))\n        wrapped (if ns\n                  (str \"(function(){var exports = Leisure.WispNS.\" (:id (:_ns_ ns)) \".exports; return \" code \";})()\")\n                  code)\n        macro (if ns\n                (.eval ns wrapped)\n                (eval code))]\n\n  (if window.DEBUG_WISP (do debugger 3))\n\n\n    (install-macro! id macro)\n    nil))\n(install-macro! 'defmacro (with-meta expand-defmacro {:implicit [:&form]}))");
          eval("(function() {\n  var symbol = Leisure.Wisp.ast.symbol;\n  var meta = Leisure.Wisp.ast.meta;\n  var withMeta = Leisure.Wisp.ast.withMeta;\n  var gensym = Leisure.Wisp.ast.gensym;\n  var installMacro = Leisure.Wisp.expander.installMacro;\n  var list = Leisure.Wisp.sequence.list;\n  var vec = Leisure.Wisp.sequence.vec;\n  var analyze = Leisure.Wisp.analyzer.analyze;\n  var compile = Leisure.Wisp.backend.escodegen.writer.compile;\n\n  " + newMacroDef.code + "\n})()");
          return resolve(wispCompile);
        });
      }));
    };
    Compiler = (function() {
      function Compiler() {}

      Compiler.prototype.compile = function(s, nsName1, wrapFunction, returnList1) {
        var newScope, oldScope, ref1;
        this.nsName = nsName1;
        this.wrapFunction = wrapFunction;
        this.returnList = returnList1;
        this.reqs = '';
        this.splice = '';
        this.exportLocs = [];
        this.pad = this.wrapFunction ? '  ' : '';
        try {
          oldScope = Leisure.wispScope;
          if (this.nsName && (newScope = findNs(this.nsName))) {
            Leisure.wispScope = newScope;
          }
          this.result = wispCompile(s, {
            "source-uri": "wispEval-" + (wispFileCounter++)
          });
        } finally {
          if (newScope) {
            Leisure.wispScope = oldScope;
          }
        }
        if (this.declaresNs = this.result.ast[0].op === 'ns') {
          this.nsName = (ref1 = this.result.ast[0].form.tail.head) != null ? ref1.name : void 0;
        }
        return {
          nameSpace: this.handleNameSpace(),
          code: this.scanNodes()
        };
      };

      Compiler.prototype.handleNameSpace = function() {
        var j, k, len, len1, names, needsExports, nsObj, ref, ref1, ref2, ref3, ref4, req;
        this.gennedNs = true;
        needsExports = true;
        if (this.nsName) {
          nsObj = findNs(this.nsName, true);
          names = {};
          findExports(this.result.ast, names, this.exportLocs);
          if (this.declaresNs && this.result.ast[0].require) {
            ref1 = this.result.ast[0].require;
            for (j = 0, len = ref1.length; j < len; j++) {
              req = ref1[j];
              ref2 = req.refer;
              for (k = 0, len1 = ref2.length; k < len1; k++) {
                ref = ref2[k];
                names[translateIdentifierWord(((ref3 = ref.rename) != null ? ref3 : ref.name).name)] = true;
              }
            }
          }
          nsObj.newNames(_.keys(names));
          if (needsExports) {
            if (this.wrapFunction) {
              this.reqs += "exports = exports || window.Leisure.WispNS." + this.nsName + ".exports;\n";
            } else {
              this.reqs += "var exports = window.Leisure.WispNS." + this.nsName + ".exports;\n";
            }
          }
          if (this.result.ast[0].require) {
            this.reqs += "var require = function(s) {\n  return Leisure.wispRequire(s, '" + (translateIdentifierWord(this.nsName)) + "');\n};\n";
          }
          if (this.declaresNs) {
            this.reqs += "_ns_ = {\n  id: '" + this.nsName + "',\n  doc: void 0\n};\n";
          } else if (this.result.ast[0].doc) {
            this.splice = "exports._ns_.doc = _ns_.doc;\n";
          }
          this.end = (ref4 = this.result.ast[0].end) != null ? ref4 : {
            line: 0,
            column: 0
          };
          if (this.pad) {
            this.splice = this.splice.replace(/\n/g, '\n' + this.pad);
          }
          this.gennedNs = false;
        } else if (needsExports) {
          if (this.wrapFunction) {
            this.reqs += "exports = exports || {};\n";
          } else {
            this.destroyExports = true;
          }
        }
        if (this.pad) {
          this.reqs = this.reqs.replace(/\n/g, '\n' + this.pad);
        }
        return nsObj;
      };

      Compiler.prototype.scanNodes = function() {
        var addReturn, children, code, con, declaredNs, destroyingExport, exprPos, exprs, file, foundEnd, head, inExpr, lastChildren, lastCode, lastLoc, nodes, prevCode, prevLoc, prevSemi, ref1, ref2, ref3, returnNode, splicedResult, startedPush, tail;
        if (this.returnList) {
          exprs = _.filter(_.map(this.result.ast, (function(_this) {
            return function(n, i) {
              var ref1;
              if (!((ref1 = n.op) === 'def' || ref1 === 'ns') && n.form && !(n.op === 'var' && n.form.name === 'debugger')) {
                return _this.result['js-ast'].body[i].loc;
              }
            };
          })(this)), identity);
          if (exprs.length) {
            this.reqs += "var $ret$ = [];\n";
          } else {
            this.returnList = false;
          }
        } else if (this.wrapFunction) {
          addReturn = true;
        }
        head = [];
        tail = [];
        foundEnd = false;
        startedPush = false;
        exprPos = 0;
        returnNode = null;
        destroyingExport = false;
        prevCode = {
          code: ''
        };
        con = SourceMapConsumer.fromSourceMap(this.result['source-map']);
        inExpr = false;
        declaredNs = false;
        nodes = SourceNode.fromStringWithSourceMap(this.result.code, con);
        if (addReturn) {
          addReturn = lastLoc = _.last(_.filter(_.map(this.result.ast, (function(_this) {
            return function(n, i) {
              var ref1, ref2;
              if (!((ref1 = n.op) === 'def' || ref1 === 'ns') && n.form) {
                return (ref2 = _this.result['js-ast'].body[i].loc) != null ? ref2.start : void 0;
              }
            };
          })(this)), identity));
        }
        prevLoc = {
          line: 1,
          column: 0
        };
        prevSemi = null;
        nodes.walk((function(_this) {
          return function(code, loc) {
            var c, c2, closeLoc, node, ref1, ref2, usedPrev;
            if ((loc != null ? loc.line : void 0) && (loc.line > prevLoc.line || loc.column > prevLoc.column)) {
              prevLoc = loc;
            }
            if (code.match(/\/\/# sourceMappingURL=/)) {
              foundEnd = true;
              code = code.replace(/\/\/# sourceMappingURL=.*/, '');
              if (!code.trim()) {
                return;
              }
            } else if (foundEnd) {
              return;
            }
            if (_this.destroyExports && !destroyingExport && code === "exports" && prevCode.code.match(/ *= */)) {
              destroyingExport = true;
              return;
            } else if (destroyingExport) {
              if (code.match(/ *= */)) {
                destroyingExport = false;
              }
              return;
            }
            if (_this.nsName) {
              if (prevLoc && _this.exportLocs.length && atOrAfter(prevLoc, _this.exportLocs[0]) && code.match(/^ *var/)) {
                declaredNs = true;
                _this.exportLocs.shift();
                code = code.replace(/^ *var /g, ' ');
              } else if (!declaredNs && _this.declaresNs && code.match(/^ *var/)) {
                code = code.replace(/^ *var /g, ' ');
              }
            }
            closeLoc = ((loc.line != null) && loc) || prevLoc;
            if (startedPush && (closeLoc.line != null) && ((closeLoc.line > exprs[exprPos].end.line) || (closeLoc.line === exprs[exprPos].end.line && (code.match(/^void 0;/) || closeLoc.column > exprs[exprPos].end.column)))) {
              startedPush = false;
              if (prevSemi) {
                c = prevSemi.node.children[0];
                c2 = c.replace(/;([ \n]*)$/, ');$1');
              }
              if (prevSemi.node && c !== c2) {
                prevSemi.node.children[0] = c2;
              } else {
                code = code.replace(/;([ \n]*)$/, ');$1');
              }
              exprPos++;
            }
            if (_this.returnList && !startedPush && (loc.line > ((ref1 = exprs[exprPos]) != null ? ref1.start.line : void 0) || (loc.line === ((ref2 = exprs[exprPos]) != null ? ref2.start.line : void 0) && loc.column >= exprs[exprPos].start.column))) {
              startedPush = true;
              usedPrev = false;
              if ((prevCode != null ? prevCode.node : void 0) && !prevCode.loc.line && !prevCode.node.children[0].match(/;/)) {
                c = prevCode.node.children[0];
                prevCode.node.children[0] = "$ret$.push(" + c;
                usedPrev = true;
              }
              if (!usedPrev) {
                code = "$ret$.push(" + code;
              }
            }
            if (_this.pad) {
              code = code.replace(/\n/g, '\n' + _this.pad);
            }
            node = new SourceNode(loc.line, loc.column, loc.source, code, loc.name);
            if (addReturn && !returnNode && loc.line === lastLoc.line && loc.column >= lastLoc.column - 1) {
              returnNode = node;
            }
            if (!_this.gennedNs && (loc.line < _this.end.line + 1 || (loc.line === _this.end.line + 1 && loc.column < _this.end.column))) {
              head.push(node);
            } else {
              _this.gennedNs = true;
              tail.push(node);
            }
            if (code.trim()) {
              prevCode = {
                code: code,
                loc: loc,
                node: node
              };
              if (code.match(/;[ \n]*$/) && !code.match(/^void 0;/)) {
                prevSemi = prevCode;
              }
              if (loc.line && (loc.line > prevLoc.line || (loc.line === prevLoc.line && loc.column > prevLoc.column))) {
                return prevLoc = loc;
              }
            }
          };
        })(this));
        file = (ref1 = _.find(nodes.children, function(n) {
          return n instanceof SourceNode;
        })) != null ? ref1.source : void 0;
        children = [head, new SourceNode(1, 0, file, this.splice), tail];
        if (returnNode) {
          code = returnNode.children[0];
          if (_.last(tail) === returnNode) {
            returnNode.children[0] = "return " + code;
          } else {
            returnNode.children[0] = "var $ret$ = " + code;
            children.push("\n" + this.pad + "return $ret$;\n");
          }
        } else if (this.returnList) {
          children.push(this.wrapFunction ? "\n" + this.pad + "return $ret$;\n" : "\n" + this.pad + "$ret$;\n");
        }
        if (startedPush) {
          lastChildren = ((ref2 = _.last(tail)) != null ? ref2.children : void 0) || ((ref3 = _.last(head)) != null ? ref3.children : void 0);
          lastCode = lastChildren[lastChildren.length - 1];
          lastChildren[lastChildren.length - 1] = lastCode.replace(/;([ \n]*)$/, ');$1');
        }
        if (this.reqs) {
          children.unshift(this.reqs);
        }
        if (this.wrapFunction) {
          children.unshift("(function(exports, console){\n" + this.pad + "console = console ? console : window.console;\n" + this.pad);
          children.push('})');
        }
        splicedResult = new SourceNode(1, 0, file, children).toStringWithSourceMap();
        if (file) {
          splicedResult.map.setSourceContent(file, con.sourceContentFor(file));
        }
        Acorn.parse(splicedResult.code);
        return splicedResult.code + ("\n//# sourceMappingURL=data:application/json;base64," + (btoa(JSON.stringify(splicedResult.map.toJSON()))) + "\n");
      };

      return Compiler;

    })();
    dumpNodes = function(nodes) {
      var output;
      output = "";
      nodes.walk(function(code, loc) {
        return output += loc.line + ":" + loc.column + " " + code + "\n";
      });
      return output;
    };
    lastExportLoc = null;
    findExports = function(ast, names, exportLocs) {
      baseFindExports(ast, names, exportLocs);
      return lastExportLoc = null;
    };
    baseFindExports = function(ast, names, exportLocs) {
      var a, j, k, len, len1, n, ref1, results, results1;
      if (ast.start) {
        lastExportLoc = ast.start;
      }
      names = names != null ? names : [];
      if (_.isArray(ast)) {
        results = [];
        for (j = 0, len = ast.length; j < len; j++) {
          a = ast[j];
          results.push(baseFindExports(a, names, exportLocs));
        }
        return results;
      } else {
        if (ast.op === 'def') {
          names[translateIdentifierWord(ast.id.id.name)] = true;
          exportLocs.push(lastExportLoc);
        }
        ref1 = ['statements', 'result', 'methods', 'init'];
        results1 = [];
        for (k = 0, len1 = ref1.length; k < len1; k++) {
          n = ref1[k];
          if (ast[n]) {
            results1.push(baseFindExports(ast[n], names, exportLocs));
          } else {
            results1.push(void 0);
          }
        }
        return results1;
      }
    };
    atOrAfter = function(nodeLoc, astLoc) {
      return nodeLoc.line - 1 > astLoc.line || (nodeLoc.line - 1 === astLoc.line && nodeLoc.column >= astLoc.column);
    };
    compile = function(s, nsName, wrapFunction, returnList) {
      this.wrapFunction = wrapFunction;
      return new Compiler().compile(s, nsName, this.wrapFunction, returnList);
    };
    Leisure.wispCompile = compile;
    Leisure.wispEval = wispEval = function() {
      var args, code, nameSpace, ref1;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      ref1 = compile.apply(null, args), nameSpace = ref1.nameSpace, code = ref1.code;
      if (nameSpace) {
        return nameSpace.wispEval(code);
      } else {
        return eval(code);
      }
    };
    Leisure.wispRequire = wispRequire;
    Leisure.wispFindNs = findNs;
    sourceMapFromCode = function(code) {
      return new SourceMapConsumer(JSON.parse(atob(code.substring(code.lastIndexOf('\n', code.length - 2)).match(/sourceMappingURL=.*base64,([^\n]*)\n/)[1])));
    };
    codeOffset = function(err, code, src, originalSrc) {
      var column, ign, line, ref1, ref2;
      ref1 = err.stack.match(/\n +at .*:([0-9]*):([0-9]*)/), ign = ref1[0], line = ref1[1], column = ref1[2];
      line = Number(line);
      column = Number(column);
      ref2 = sourceMapFromCode(code).originalPositionFor({
        line: line - 1,
        column: column
      }), line = ref2.line, column = ref2.column;
      return lineColumnStrOffset(src, line, column) + (originalSrc != null ? originalSrc : src).length - src.length;
    };
    envFunc = function(env) {
      env.presentHtml = function(str) {
        if (str.toString()) {
          str = str.toString();
          if (str.name) {
            str = str.name;
          }
        }
        return presentHtml(str.replace(/\uFEFF/g, '').replace(/\uA789/g, ':').replace(/\u2044/g, '\/'));
      };
      env.executeText = function(text, props, cont) {
        return setLounge(this, (function(_this) {
          return function() {
            var result;
            result = [Leisure.wispEval(text)];
            if (cont) {
              return cont(result);
            } else {
              return result;
            }
          };
        })(this));
      };
      env.executeBlock = function(block, cont) {
        var p;
        p = this.compileBlock(block);
        if (p instanceof Promise) {
          return p.then(function(f) {
            return f.call(this, cont);
          });
        } else {
          return p.call(this, cont);
        }
      };
      env.compileBlock = function(block) {
        var action;
        action = (function(_this) {
          return function() {
            var code, column, err, error, func, ignore, line, m, macros, msg, nameSpace, ns, original, pos, props, ref1, ref2, ref3, ref4, res;
            original = res = "" + (blockSource(block).trim());
            try {
              props = _this.data.properties(block);
              ns = (ref1 = (ref2 = props.namespace) != null ? ref2.trim() : void 0) != null ? ref1 : void 0;
              if (ns) {
                if (props.macro) {
                  macros = true;
                }
                ns = ns.match(/^[^ ]+/)[0];
              }
              ref3 = compile(res, ns, true, true), nameSpace = ref3.nameSpace, code = ref3.code;
              func = nameSpace ? nameSpace.wispEval(code) : eval(code);
              return function() {
                var args, cont, cur, envConsole, err, error, ref4;
                cont = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
                env = this;
                envConsole = {
                  log: function() {
                    var args;
                    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
                    return env.write(args.join(' '));
                  }
                };
                try {
                  return setLounge(env, function() {
                    return (cont != null ? cont : identity)(_.filter(func.call.apply(func, [env, null, envConsole].concat(slice.call(args))), function(n) {
                      return typeof n !== 'undefined';
                    }));
                  });
                } catch (error) {
                  err = error;
                  console.error((ref4 = err.stack) != null ? ref4 : err);
                  if ((cur = env.data.getBlock(block._id)) && original !== blockSource(cur).trim()) {
                    console.error("Warning, code is from a different version of block " + block._id);
                  }
                  env.errorAt(codeOffset(err, code, res, original), err.message);
                  return (cont != null ? cont : identity)([]);
                }
              };
            } catch (error) {
              err = error;
              console.error((ref4 = err.stack) != null ? ref4 : err);
              if (m = err.message.match(/^([^\n]+)\nline:([^\n]+)\ncolumn:([^\n]+)(\n|$)/)) {
                ignore = m[0], msg = m[1], line = m[2], column = m[3];
                pos = lineColumnStrOffset(res, Number(line.trim()), Number(column.trim()));
                pos += original.length - res.length;
                return env.errorAt(pos, msg);
              } else if (code) {
                return env.errorAt(codeOffset(err, code, res, original), err.message);
              } else {
                return env.errorAt(0, err.message);
              }
            }
          };
        })(this);
        if (wispPromise().isResolved()) {
          return action();
        } else {
          return wispPromise().then(action);
        }
      };
      env.generateCode = function(text, noFunc) {
        debugger;
      };
      return env;
    };
    Leisure.assert = function(test, msg) {
      return assert(test, msg);
    };
    return function(env) {
      return wispPromise().then(function() {
        envFunc(env);
        return resolve(envFunc);
      });
    };
  });

}).call(this);

//# sourceMappingURL=wispSupport.js.map
