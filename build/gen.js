// Generated by CoffeeScript 1.10.0

/*
Copyright (C) 2013, Bill Burdick, Tiny Concepts: https://github.com/zot/Leisure

(licensed with ZLIB license)

This software is provided 'as-is', without any express or implied
warranty. In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.

2. Altered source versions must be plainly marked as such, and must not be
misrepresented as being the original software.

3. This notice may not be removed or altered from any source distribution.
 */

(function() {
  var slice = [].slice;

  define(['./base', './ast', './runtime', 'lodash', 'lib/source-map', 'browser-source-map-support'], function(Base, Ast, Runtime, _, SourceMap, SourceMapSupport) {
    var Leisure_anno, Leisure_apply, Leisure_lambda, Leisure_let, Leisure_lit, Leisure_ref, Monad2, Nil, SourceMapConsumer, SourceMapGenerator, SourceNode, ThunkStack, USE_STRICT, _false, _true, _unit, addLambdaProperties, addUniq, arrayify, assocListProps, booleanFor, check, checkChild, codeNum, collectArgs, cons, consFrom, curDef, currentFile, currentFuncName, curryCall, define, dumpAnno, dumpMonadStack, findName, functionInfo, gen, genApplyArg, genArifiedApply, genArifiedLambda, genLambda, genLetAssign, genLets, genMap, genNode, genPushThunk, genRefName, genSource, genThunkStack, genUniq, getAnnoBody, getAnnoData, getAnnoName, getApplyArg, getApplyFunc, getAssocListProps, getLambdaArgs, getLambdaBody, getLambdaProperties, getLambdaVar, getLastLetBody, getLetBody, getLetName, getLetValue, getLitVal, getNArgs, getNthLambdaBody, getPos, getRefName, getType, isNil, jsCodeFor, lacons, lazify, lazy, lc, lcons, lconsFrom, left, letList, locateAst, location, lz, megaArity, nameSub, newConsFrom, nsLog, parseErr, ref1, ref2, resolve, reverseThunks, right, root, rz, setDataType, setMegaArity, setType, simpyCons, sn, specialAnnotations, stackSize, trace, uniqName, useArity, varNameSub, verboseMsg, withFile;
    if (SourceMapSupport != null) {
      SourceMapSupport.install();
    }
    simpyCons = Base.simpyCons, resolve = Base.resolve, lazy = Base.lazy, verboseMsg = Base.verboseMsg, nsLog = Base.nsLog;
    rz = resolve;
    lz = lazy;
    lc = Leisure_call;
    ref1 = root = Ast, nameSub = ref1.nameSub, getLitVal = ref1.getLitVal, getRefName = ref1.getRefName, getLambdaVar = ref1.getLambdaVar, getLambdaBody = ref1.getLambdaBody, getApplyFunc = ref1.getApplyFunc, getApplyArg = ref1.getApplyArg, getAnnoName = ref1.getAnnoName, getAnnoData = ref1.getAnnoData, getAnnoBody = ref1.getAnnoBody, getLetName = ref1.getLetName, getLetValue = ref1.getLetValue, getLetBody = ref1.getLetBody, Leisure_lit = ref1.Leisure_lit, Leisure_ref = ref1.Leisure_ref, Leisure_lambda = ref1.Leisure_lambda, Leisure_apply = ref1.Leisure_apply, Leisure_let = ref1.Leisure_let, Leisure_anno = ref1.Leisure_anno, setType = ref1.setType, setDataType = ref1.setDataType, cons = ref1.cons, Nil = ref1.Nil, define = ref1.define, functionInfo = ref1.functionInfo, getPos = ref1.getPos, isNil = ref1.isNil, getType = ref1.getType;
    Monad2 = Runtime.Monad2, _true = Runtime._true, _false = Runtime._false, _unit = Runtime._unit, left = Runtime.left, right = Runtime.right, booleanFor = Runtime.booleanFor, newConsFrom = Runtime.newConsFrom, dumpMonadStack = Runtime.dumpMonadStack;
    consFrom = newConsFrom;
    SourceNode = SourceMap.SourceNode, SourceMapConsumer = SourceMap.SourceMapConsumer, SourceMapGenerator = SourceMap.SourceMapGenerator;
    varNameSub = function(n) {
      return "L_" + (nameSub(n));
    };
    useArity = true;
    megaArity = false;
    curDef = null;
    trace = false;
    trace = true;
    stackSize = 20;
    genThunkStack = false;
    USE_STRICT = '"use strict";';
    setMegaArity = function(setting) {
      return megaArity = setting;
    };
    collectArgs = function(args, result) {
      var i, j, len;
      for (j = 0, len = args.length; j < len; j++) {
        i = args[j];
        if (Array.isArray(i)) {
          collectArgs(i, result);
        } else {
          result.push(i);
        }
      }
      return result;
    };
    locateAst = function(ast) {
      var col, line, pos, ref2;
      ref2 = pos = getPos(ast).toArray(), line = ref2[0], col = ref2[1];
      return [line, col];
    };
    check = function(bool, arg) {
      if (!bool) {
        return console.log(new Error("Bad sourcemap arg: " + arg).stack);
      }
    };
    checkChild = function(child) {
      if (Array.isArray(child)) {
        return child.forEach(checkChild);
      } else {
        return check((typeof child === 'string') || (child instanceof SourceNode), child);
      }
    };
    currentFile = 'NEVERGIVENFILE.lsr';
    currentFuncName = void 0;
    withFile = function(file, name, block) {
      var oldFileName, oldFuncName;
      oldFileName = currentFile;
      oldFuncName = currentFuncName;
      currentFile = file;
      currentFuncName = name;
      try {
        return block();
      } finally {
        currentFile = oldFileName;
        currentFuncName = oldFuncName;
      }
    };
    sn = function() {
      var ast, line, offset, ref2, str;
      ast = arguments[0], str = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      ref2 = locateAst(ast), line = ref2[0], offset = ref2[1];
      check(typeof line === 'number', 'line');
      check(typeof offset === 'number', 'offset');
      checkChild(str);
      if (line < 1) {
        line = 1;
      }
      if (currentFile === 'NEVERGIVENFILE.lsr') {
        console.log(new Error("SN CALLED WITHOUT FILE").stack);
      }
      if (currentFuncName != null) {
        return new SourceNode(line, offset, currentFile, str, currentFuncName);
      } else {
        return new SourceNode(line, offset, currentFile, str);
      }
    };
    genNode = function(ast) {
      return genUniq(ast, Nil, [Nil, 0]);
    };
    gen = function(ast) {
      return jsCodeFor(new SourceNode(1, 0, currentFile, ['(', genMap(ast), ')']).toStringWithSourceMap({
        file: currentFile
      }));
    };
    jsCodeFor = function(codeMap) {
      return codeMap.code + "\n//# sourceMappingURL=data:application/json;base64," + (btoa(JSON.stringify(codeMap.map.toJSON()))) + "\n";
    };
    codeNum = 0;
    genSource = function(source, ast) {
      var funcname;
      funcname = ast instanceof Leisure_anno && getAnnoName(ast) === 'leisureName' ? getAnnoData(ast) : null;
      return withFile("dynamic code with source " + (++codeNum), funcname, function() {
        var code, err, error, map, sm;
        try {
          sm = genNode(ast).prepend("\n").toStringWithSourceMap({
            file: "dynamic code with source"
          });
          map = JSON.parse(sm.map.toString());
          map.sourcesContent = [source];
          code = "(" + sm.code + ")\n//# sourceMappingURL=data:application/json;utf-8;base64," + (btoa(JSON.stringify(map))) + "\n";
          return code;
        } catch (error) {
          err = error;
          err.message = "Error generating code for:\n  " + (source.trim().replace(/\n/g, '\n  ')) + "\n" + err.message;
          throw err;
        }
      });
    };
    genMap = function(ast) {
      var filename, funcname, hasFile, line, nameAst, offset, ref2, sub;
      hasFile = ast instanceof Leisure_anno && getAnnoName(ast) === 'filename';
      filename = hasFile ? getAnnoData(ast) : 'GENFORUNKNOWNFILE.lsr';
      nameAst = hasFile ? getAnnoBody(ast) : null;
      funcname = nameAst instanceof Leisure_anno && getAnnoName(nameAst) === 'leisureName' ? getAnnoData(nameAst) : currentFuncName;
      sub = withFile(filename, null, function() {
        return genNode(ast);
      });
      ref2 = locateAst(ast), line = ref2[0], offset = ref2[1];
      if (funcname) {
        return new SourceNode(line, offset, filename, sub, funcname);
      } else {
        return sub;
      }
    };
    findName = function(name) {
      var i, j, ref2, ref3;
      for (i = j = ref2 = root.nameSpacePath.length - 1; ref2 <= 0 ? j <= 0 : j >= 0; i = ref2 <= 0 ? ++j : --j) {
        if ((ref3 = LeisureNameSpaces[root.nameSpacePath[i]]) != null ? ref3[name] : void 0) {
          return root.nameSpacePath[i];
        }
      }
      if (root.currentNameSpace && LeisureNameSpaces[root.currentNameSpace][name]) {
        return root.currentNameSpace;
      } else {
        return null;
      }
    };
    location = function(ast) {
      var col, line, ref2;
      ref2 = locateAst(ast), line = ref2[0], col = ref2[1];
      return line + ":" + col;
    };
    genRefName = function(ref, uniq, names) {
      var name, ns, val;
      name = getRefName(ref);
      if (isNil((val = names.find(function(el) {
        return el === name;
      })))) {
        ns = findName(nameSub(name));
        if (ns === root.currentNameSpace) {
          nsLog("LOCAL NAME: " + name + " FOR " + root.currentNameSpace + " " + (location(ref)));
        } else if (!ns) {
          nsLog("GUESSING LOCAL NAME " + name + " FOR " + root.currentNameSpace + " " + (location(ref)));
        }
        return varNameSub(name);
      } else {
        return uniqName(name, uniq);
      }
    };
    genUniq = function(ast, names, uniq, count) {
      var arity, data, funcName, genned, name, oldDef, ref2, src;
      switch (ast.constructor) {
        case Leisure_lit:
          return sn(ast, JSON.stringify(getLitVal(ast)));
        case Leisure_ref:
          return sn(ast, "resolve(", genRefName(ast, uniq, names), ")");
        case Leisure_lambda:
          return genLambda(ast, names, uniq, count != null ? count : 0);
        case Leisure_apply:
          if (useArity) {
            return genArifiedApply(ast, names, uniq, arity);
          } else {
            return sn(ast, genUniq(getApplyFunc(ast), names, uniq), "(", genApplyArg(getApplyArg(ast), names, uniq), ")");
          }
          break;
        case Leisure_let:
          return sn(ast, "(function(){" + USE_STRICT + "\n", genLets(ast, names, uniq), "})()");
        case Leisure_anno:
          name = getAnnoName(ast);
          data = getAnnoData(ast);
          if (name === 'arity' && useArity && data > 1) {
            return genArifiedLambda(getAnnoBody(ast), names, uniq, data);
          } else {
            try {
              if (trace && name === 'leisureName') {
                oldDef = curDef;
                curDef = data;
              }
              genned = genUniq(getAnnoBody(ast), names, uniq);
              switch (name) {
                case 'type':
                  return sn(ast, "setType(", genned, ", '", data, "')");
                case 'dataType':
                  return sn(ast, "setDataType(", genned, ", '", data, "')");
                case 'define':
                  ref2 = data.toArray(), funcName = ref2[0], arity = ref2[1], src = ref2[2];
                  return sn(ast, "define('", funcName, "', lazify(ast, genned), ", arity, ", ", JSON.stringify(src), ")");
                case 'leisureName':
                  return genned;
                default:
                  return genned;
              }
            } finally {
              if (trace && name === 'leisureName') {
                curDef = oldDef;
              }
            }
          }
          break;
        default:
          return "CANNOT GENERATE CODE FOR UNKNOWN AST TYPE: " + ast + ", " + ast.constructor + " " + Leisure_lambda;
      }
    };
    genArifiedApply = function(ast, names, uniq) {
      var argCode, args, arity, defaultArity, dmp, func, funcName, i, info, j, m, ref2, ref3, ref4;
      args = [];
      func = ast;
      while (dumpAnno(func) instanceof Leisure_apply) {
        args.push(getApplyArg(dumpAnno(func)));
        func = getApplyFunc(dumpAnno(func));
      }
      args.reverse();
      defaultArity = false;
      if (args.length > 1 && ((dmp = dumpAnno(func)) instanceof Leisure_ref) && (((info = functionInfo[funcName = getRefName(dmp)]) && ((info.newArity && (arity = info.arity) && arity <= args.length) || (!arity && megaArity))) || (!info && isNil(names.find(function(el) {
        return el === funcName;
      }))))) {
        if (defaultArity = !arity) {
          arity = args.length;
        }
        argCode = [];
        argCode.push(ast);
        if (defaultArity) {
          argCode.push('L$(');
        }
        argCode.push(genUniq(func, names, uniq));
        if (defaultArity) {
          argCode.push(')(');
        } else {
          argCode.push('(');
        }
        for (i = j = 0, ref2 = arity; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
          if (i > 0) {
            argCode.push(', ');
          }
          argCode.push(sn(args[i], genApplyArg(args[i], names, uniq)));
        }
        argCode.push(')');
        for (i = m = ref3 = arity, ref4 = args.length; m < ref4; i = m += 1) {
          argCode.push('(', sn(args[i], genApplyArg(args[i], names, uniq)), ')');
        }
        return sn.apply(null, argCode);
      } else {
        ast = dumpAnno(ast);
        return sn(ast, genUniq(getApplyFunc(ast), names, uniq), "(", genApplyArg(getApplyArg(ast), names, uniq), ")");
      }
    };
    genLambda = function(ast, names, uniq, count) {
      var n, name, u;
      name = getLambdaVar(ast);
      u = addUniq(name, names, uniq);
      n = cons(name, names);
      if (curDef && genThunkStack) {
        return addLambdaProperties(ast, sn(ast, 'function(', uniqName(name, u), '){var old = ', genPushThunk(ast), '; var ret = ', genUniq(getLambdaBody(ast), n, u, 1), '; L$setThunkStack(old); return ret;}'));
      } else {
        return addLambdaProperties(ast, sn(ast, 'function(', uniqName(name, u), '){return ', genUniq(getLambdaBody(ast), n, u, 1), '}'));
      }
    };
    getLambdaArgs = function(ast) {
      var args;
      args = [];
      while (ast instanceof Leisure_lambda) {
        args.push(getLambdaVar(ast));
        ast = getLambdaBody(ast);
      }
      return [args, ast];
    };
    genArifiedLambda = function(ast, names, uniq, arity) {
      var annoAst, argList, args, data, mainFunc, name, result;
      if (arity < 2) {
        return genLambda(ast, names, uniq, 0);
      } else {
        args = getNArgs(arity, ast).toArray();
        argList = _.map(args, (function(x) {
          return 'L_' + x;
        })).join(', ');
        mainFunc = sn(ast, "(function(" + argList + ") {\n    return arguments.callee.length != arguments.length\n        ? Leisure_primCall(arguments.callee, 0, arguments)\n        : ", genUniq(getNthLambdaBody(ast, arity), names, uniq), ";\n})");
        result = addLambdaProperties(ast, sn(ast, mainFunc));
        annoAst = ast;
        while (annoAst instanceof Leisure_anno) {
          name = getAnnoName(annoAst);
          data = getAnnoData(annoAst);
          switch (name) {
            case 'type':
              result = sn(ast, "setType(", result, ", '", data, "')");
              break;
            case 'dataType':
              result = sn(ast, "setDataType(", result, ", '", data, "')");
          }
          annoAst = getAnnoBody(annoAst);
        }
        return result;
      }
    };
    getNthLambdaBody = function(ast, n) {
      var d;
      if (n === 0) {
        return ast;
      } else if ((d = dumpAnno(ast)) instanceof Leisure_lambda) {
        return getNthLambdaBody(getLambdaBody(d), n - 1);
      } else {
        throw new Error("Expected lambda but got " + ast);
      }
    };
    ((ref2 = typeof window !== "undefined" && window !== null ? window : global) != null ? ref2 : {}).curryCall = curryCall = function(args, func) {
      var f, i, j, ref2;
      f = func(args[0]);
      for (i = j = 1, ref2 = args.length; 1 <= ref2 ? j < ref2 : j > ref2; i = 1 <= ref2 ? ++j : --j) {
        f = f(args[i]);
      }
      return f;
    };
    getNArgs = function(n, ast) {
      var d;
      d = dumpAnno(ast);
      if (!n) {
        return Nil;
      } else {
        return cons(getLambdaVar(d), getNArgs(n - 1, getLambdaBody(d)));
      }
    };
    specialAnnotations = ['type', 'dataType', 'define'];
    arrayify = function(cons) {
      if (cons instanceof Leisure_cons) {
        return cons.map(function(el) {
          return arrayify(el);
        }).toArray();
      } else {
        return cons;
      }
    };
    getLambdaProperties = function(body, props) {
      var value;
      if (body instanceof Leisure_anno) {
        if (!_.includes(specialAnnotations, getAnnoName(body))) {
          if (!props) {
            props = {};
          }
          value = getAnnoData(body);
          props[getAnnoName(body)] = arrayify(value);
        }
        getLambdaProperties(getAnnoBody(body), props);
      }
      return props;
    };
    addLambdaProperties = function(ast, def, extras) {
      var p, props;
      props = getLambdaProperties(getLambdaBody(ast));
      if (props || extras) {
        p = {};
        if (props) {
          _.merge(p, props);
        }
        if (extras) {
          _.merge(p, extras);
        }
        return sn(ast, "setLambdaProperties(", def, ", ", JSON.stringify(p), ")");
      } else {
        return def;
      }
    };
    lcons = function(a, b) {
      return rz(L_cons)(lz(a))(lz(b));
    };
    parseErr = function(a, b) {
      return rz(L_parseErr)(a, b);
    };
    lconsFrom = function(array) {
      var el, j, len, p, ref3;
      if (array instanceof Array) {
        p = rz(L_nil);
        ref3 = array.reverse();
        for (j = 0, len = ref3.length; j < len; j++) {
          el = ref3[j];
          p = lcons(lconsFrom(el), p);
        }
        return p;
      } else {
        return array;
      }
    };
    assocListProps = null;
    getAssocListProps = function() {
      if (!assocListProps) {
        assocListProps = lcons(lcons('assoc', 'true'), rz(L_nil));
        assocListProps.properties = assocListProps;
      }
      return assocListProps;
    };
    lacons = function(key, value, list) {
      var alist;
      alist = lcons(lcons(key, value), list);
      alist.properties = getAssocListProps();
      return alist;
    };
    (typeof window !== "undefined" && window !== null ? window : global).setLambdaProperties = function(def, props) {
      var k, p, v;
      p = rz(L_nil);
      for (k in props) {
        v = props[k];
        p = lacons(k, lconsFrom(v), p);
      }
      def.properties = p;
      return def;
    };
    ThunkStack = (function() {
      function ThunkStack(front, back, frontLen, backLen) {
        this.front = front;
        this.back = back;
        this.frontLen = frontLen;
        this.backLen = backLen;
      }

      ThunkStack.prototype.push = function(item) {
        if (this.backLen + this.frontLen >= stackSize) {
          if (this.backLen === 0) {
            return new ThunkStack(null, reverseThunks([item, this.front])[1], 0, this.frontLen);
          } else {
            return new ThunkStack([item, this.front], this.back[1], this.frontLen + 1, this.backLen - 1);
          }
        } else {
          return new ThunkStack([item, this.front], this.back, this.frontLen + 1, this.backLen);
        }
      };

      ThunkStack.prototype.items = function() {
        var frontItems, items, stack;
        items = [];
        frontItems = [];
        stack = this.back;
        while (stack) {
          items.push(stack[0]);
          stack = stack[1];
        }
        stack = this.front;
        while (stack) {
          frontItems.push(stack[0]);
          stack = stack[1];
        }
        return items.concat(frontItems.reverse());
      };

      return ThunkStack;

    })();
    (typeof global !== "undefined" && global !== null ? global : window).L$emptyThunkStack = new ThunkStack(null, null, 0, 0);
    reverseThunks = function(stack) {
      var result;
      result = null;
      while (stack) {
        result = [stack[0], result];
        stack = stack[1];
      }
      return result;
    };
    (typeof global !== "undefined" && global !== null ? global : window).L$thunkStack = [];
    (typeof global !== "undefined" && global !== null ? global : window).L$convertError = function(err, args) {
      if (!err.L_stack) {
        console.log('CONVERTING ERROR:', err);
        (typeof global !== "undefined" && global !== null ? global : window).ERR = err;
        err.L_stack = args.callee.L$stack;
        err.L_args = args;
      }
      return err;
    };
    (typeof global !== "undefined" && global !== null ? global : window).L$pushThunk = function(stack, entry) {
      var old;
      old = L$thunkStack;
      (typeof global !== "undefined" && global !== null ? global : window).L$thunkStack = stack.slice(Math.max(0, stack.length - 9));
      stack.push(entry);
      return old;
    };
    (typeof global !== "undefined" && global !== null ? global : window).L$setThunkStack = function(stack) {
      return (typeof global !== "undefined" && global !== null ? global : window).L$thunkStack = stack;
    };
    genPushThunk = function(ast) {
      var line, offset, ref3;
      if (genThunkStack) {
        ref3 = locateAst(ast), line = ref3[0], offset = ref3[1];
        return "L$pushThunk((typeof stack != 'undefined' ? stack : L$thunkStack || L$emptyThunkStack), '" + curDef + ":" + line + ":" + offset + "')";
      } else {
        return '';
      }
    };
    lazify = function(ast, body) {
      if (curDef && genThunkStack) {
        return sn(ast, "(function(){" + USE_STRICT + "var stack = L$thunkStack; var f = function(){var old = ", genPushThunk(ast), '; var ret = ', body, '; L$setThunkStack(old); if (f.memo) stack = null; return ret;}; return f;})()');
      } else {
        return sn(ast, "function(){" + USE_STRICT + "return ", body, ';}');
      }
    };
    dumpAnno = function(ast) {
      if (ast instanceof Leisure_anno) {
        return dumpAnno(getAnnoBody(ast));
      } else {
        return ast;
      }
    };
    genApplyArg = function(arg, names, uniq) {
      var d;
      d = dumpAnno(arg);
      if (d instanceof Leisure_apply) {
        return lazify(d, genUniq(arg, names, uniq));
      } else if (d instanceof Leisure_ref) {
        return genRefName(d, uniq, names);
      } else if (d instanceof Leisure_lit) {
        return sn(arg, JSON.stringify(getLitVal(d)));
      } else if (d instanceof Leisure_let) {
        return lazify(arg, genUniq(arg, names, uniq));
      } else if (d instanceof Leisure_lambda) {
        return sn(arg, 'lazy(', genUniq(arg, names, uniq), ')');
      } else {
        return lazify(arg, genUniq(arg, names, uniq));
      }
    };
    genLetAssign = function(arg, names, uniq) {
      if (dumpAnno(arg) instanceof Leisure_let) {
        return lazify(arg, genLets(arg, names, uniq));
      } else {
        return lazify(arg, genUniq(arg, names, uniq));
      }
    };
    genLets = function(ast, names, uniq) {
      var assigns, bindings, decs, letNames, letUniq, ref3;
      bindings = letList(ast, []);
      letNames = _.reduce(bindings, (function(n, l) {
        return cons(getLetName(l), n);
      }), names);
      ref3 = _.reduce(bindings, (function(result, l) {
        var assigns, code, letName, newU, u;
        u = result[0], code = result[1], assigns = result[2];
        newU = addUniq(getLetName(l), letNames, u);
        letName = uniqName(getLetName(l), newU);
        return [newU, cons(sn(ast, letName + ' = ', genLetAssign(getLetValue(l), letNames, u)), code), cons(letName, assigns)];
      }), [uniq, Nil, Nil]), letUniq = ref3[0], decs = ref3[1], assigns = ref3[2];
      return sn(ast, "  var ", assigns.reverse().join(', '), ";\n  ", decs.reverse().intersperse(';\n  ').toArray(), ";\n\n  return ", genUniq(getLastLetBody(ast), letNames, letUniq));
    };
    addUniq = function(name, names, uniq) {
      var num, overrides;
      if ((names.find(function(el) {
        return el === name;
      })) !== Nil) {
        overrides = uniq[0], num = uniq[1];
        return [cons(cons(name, name + "_" + num), overrides), num + 1];
      } else {
        return uniq;
      }
    };
    uniqName = function(name, uniq) {
      var kv;
      uniq = uniq[0];
      kv = uniq.find((function(el) {
        return el.head() === name;
      }), uniq);
      return varNameSub((kv !== Nil ? kv.tail() : name));
    };
    letList = function(ast, buf) {
      if (ast instanceof Leisure_let) {
        buf.push(ast);
        return letList(getLetBody(ast), buf);
      } else {
        return buf;
      }
    };
    getLastLetBody = function(ast) {
      if (ast instanceof Leisure_let) {
        return getLastLetBody(getLetBody(ast));
      } else {
        return ast;
      }
    };
    define('traceOff', new Monad2('traceOff', function(env, cont) {
      trace = false;
      return cont(_unit);
    }));
    define('traceOn', new Monad2('traceOn', function(env, cont) {
      trace = true;
      return cont(_unit);
    }));
    define('runAst', (function(code) {
      return function(ast) {
        return new Monad2('runAst', function(env, cont) {
          var baseMsg, codeMsg, err, error, jsCode;
          jsCode = null;
          try {
            jsCode = genSource(rz(code), rz(ast));
            return cont(eval(jsCode));
          } catch (error) {
            err = error;
            dumpMonadStack(err, env);
            codeMsg = (jsCode ? "CODE: \n" + jsCode + "\n" : '');
            baseMsg = "\n\nParse error: " + err.message + "\n" + codeMsg + "AST: ";
            err.message = "" + baseMsg + (ast());
            console.log(err);
            return cont(parseErr(lz(baseMsg), ast));
          }
        });
      };
    }), null, null, null, 'parser');
    define('genAst', (function(ast) {
      var err, error;
      try {
        return gen(rz(ast));
      } catch (error) {
        err = error;
        return parseErr(lz('\n\nParse error: ' + err.toString() + "AST: "), ast);
      }
    }), null, null, null, 'parser');
    return {
      gen: gen,
      genMap: genMap,
      genSource: genSource,
      genNode: genNode,
      sourceNode: sn,
      withFile: withFile,
      curryCall: curryCall,
      SourceNode: SourceNode,
      SourceMapConsumer: SourceMapConsumer,
      SourceMapGenerator: SourceMapGenerator,
      setMegaArity: setMegaArity
    };
  });

}).call(this);

//# sourceMappingURL=gen.js.map
