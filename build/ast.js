// Generated by CoffeeScript 1.10.0

/*
Copyright (C) 2012, Bill Burdick, Tiny Concepts: https://github.com/zot/Leisure

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
  'use strict';
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['./base', 'lodash'], function(base, _) {
    var L_anno, L_apply, L_lambda, L_let, L_lit, L_ref, LeisureObject, Leisure_cons, Leisure_list, Leisure_nil, Nil, anno, apply, ast2Json, ast2JsonEncodings, astString, charCodes, checkType, classForType, classNameForType, cons, consEq, consFrom, declareTypeFunc, define, doPartial, dummyPosition, ensureLeisureClass, evalFunc, firstRange, foldLeft, functionInfo, getAnnoBody, getAnnoData, getAnnoName, getAnnoRange, getApplyArg, getApplyFunc, getApplyRange, getDataType, getLambdaBody, getLambdaRange, getLambdaVar, getLetBody, getLetName, getLetRange, getLetValue, getLitRange, getLitVal, getPos, getRefName, getRefRange, getType, head, isNil, isPartial, jsType, json2Ast, json2AstEncodings, jsonToRange, lambda, lazy, lc, leisureAddFunc, leisureFunctionNamed, letStr, lit, llet, lz, mkProto, nakedDefine, nameFunc, nameSub, nsLog, partialCall, primCons, primFoldLeft, rangeToJson, redefined, ref, ref1, resolve, root, rz, save, setDataType, setType, tail, throwError, types;
    ref1 = root = base, resolve = ref1.resolve, lazy = ref1.lazy, nsLog = ref1.nsLog;
    rz = resolve;
    lz = lazy;
    lc = Leisure_call;
    types = {};
    charCodes = {
      "'": '$a',
      ',': '$b',
      '$': '$$',
      '@': '$d',
      '?': '$e',
      '/': '$f',
      '*': '$g',
      '&': '$h',
      '^': '$i',
      '!': '$k',
      '`': '$l',
      '~': '$m',
      '-': '$_',
      '+': '$o',
      '=': '$p',
      '|': '$q',
      '[': '$r',
      ']': '$s',
      '{': '$t',
      '}': '$u',
      '"': '$v',
      ':': '$w',
      ';': '$x',
      '<': '$y',
      '>': '$z',
      '%': '$A',
      '.': '$B',
      '#': '$C',
      ' ': '$S'
    };
    nameSub = function(name) {
      var code, i, j, ref2, s;
      s = '';
      for (i = j = 0, ref2 = name.length; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
        code = charCodes[name[i]];
        s += code != null ? code : name[i];
      }
      return s;
    };
    global.LeisureFunctionInfo = functionInfo = {};
    redefined = {};
    leisureFunctionNamed = function(n) {
      return LeisureFunctionInfo[nameSub(n)].def;
    };
    setDataType = function(func, dataType) {
      if (dataType) {
        func.dataType = dataType;
      }
      return func;
    };
    setType = function(func, type) {
      if (type) {
        func.type = type;
      }
      func.__proto__ = (ensureLeisureClass(type)).prototype;
      return func;
    };
    LeisureObject = (function() {
      function LeisureObject() {}

      LeisureObject.prototype.className = 'LeisureObject';

      LeisureObject.prototype.toString = function() {
        return this.leisureName;
      };

      return LeisureObject;

    })();
    LeisureObject.prototype.__proto__ = Function.prototype;
    if ((typeof global === "undefined" || global === null) && (typeof window !== 'undefined')) {
      window.global = window;
    }
    global.Leisure_Object = LeisureObject;
    root.leisureClassChange = 0;
    classNameForType = function(type) {
      return "Leisure_" + (nameSub(type));
    };
    classForType = function(type) {
      return types[type];
    };
    declareTypeFunc = function(leisureClass, constructor) {
      var f, funcName;
      if (constructor) {
        types[leisureClass] = global['Leisure_' + nameSub(leisureClass)] = constructor;
      }
      funcName = 'L_' + nameSub(leisureClass);
      f = global[funcName] = lz(function(x) {
        throw new Error("Attempt to call type function " + funcName);
      });
      functionInfo[leisureClass] = {
        arity: 1,
        leisureName: leisureClass,
        alts: {},
        altList: [],
        def: f
      };
      f.leisureLength = 1;
      f.leisureName = leisureClass;
      f.typeFunction = true;
      f.__proto__ = LeisureObject;
      return setDataType(f, leisureClass);
    };
    ensureLeisureClass = function(leisureClass, superclassName) {
      var cl, err, error, supercl, type;
      if (!(type = types[leisureClass])) {
        cl = classNameForType(leisureClass);
        if (global[cl] == null) {
          supercl = (superclassName ? global[classNameForType(superclassName)] : LeisureObject);
          try {
            type = types[leisureClass] = global[cl] = eval("(function " + cl + "(){})");
            if (supercl && typeof supercl === 'function' && (supercl === LeisureObject || supercl.prototype instanceof LeisureObject)) {
              global[cl].prototype = new supercl;
              global[cl].prototype.constructor = global[cl];
            } else {
              throw new Error("Invalid supertype: " + superclassName);
            }
            if (!functionInfo[leisureClass]) {
              declareTypeFunc(leisureClass);
            }
            root.leisureClassChange++;
          } catch (error) {
            err = error;
            console.log("Error creating class " + leisureClass + (typeof superClassName !== "undefined" && superClassName !== null ? ' extends ' + superClassName : ''), "superclass: ", supercl);
            throw err;
          }
        } else {
          throw new Error("System error: existing type " + leisureClass + " is not in types map");
        }
      }
      return type;
    };
    ensureLeisureClass('string');
    ensureLeisureClass('number');
    ensureLeisureClass('sequence');
    ensureLeisureClass('ast');
    ensureLeisureClass('lit', 'ast');
    ensureLeisureClass('ref', 'ast');
    ensureLeisureClass('lambda', 'ast');
    ensureLeisureClass('apply', 'ast');
    ensureLeisureClass('let', 'ast');
    ensureLeisureClass('anno', 'ast');
    ensureLeisureClass('doc');
    ensureLeisureClass('srcLocation');
    ensureLeisureClass('pattern');
    isNil = function(obj) {
      return obj instanceof Leisure_nil;
    };
    Leisure_lit.prototype.toString = function() {
      return "lit(" + (getLitVal(this)) + ")";
    };
    Leisure_ref.prototype.toString = function() {
      return "ref(" + (getRefName(this)) + ")";
    };
    Leisure_lambda.prototype.toString = function() {
      return "lambda(" + (astString(this)) + ")";
    };
    Leisure_apply.prototype.toString = function() {
      return "apply(" + (astString(this)) + ")";
    };
    Leisure_let.prototype.toString = function() {
      return "let(" + (astString(this)) + ")";
    };
    Leisure_anno.prototype.toString = function() {
      return "anno(" + (astString(this)) + ")";
    };
    astString = function(ast) {
      var argStr, funcStr, ref2;
      switch (getType(ast)) {
        case 'lit':
          return getLitVal(ast);
        case 'ref':
          return getRefName(ast);
        case 'apply':
          funcStr = astString(getApplyFunc(ast));
          if ((ref2 = getType(getApplyFunc(ast))) === 'lambda' || ref2 === 'let') {
            funcStr = "(" + funcStr + ")";
          }
          argStr = astString(getApplyArg(ast));
          if (getType(getApplyArg(ast)) === 'apply') {
            argStr = "(" + argStr + ")";
          }
          return funcStr + " " + argStr;
        case 'lambda':
          return "\\" + (getLambdaVar(ast)) + " . " + (astString(getLambdaBody(ast)));
        case 'let':
          return "\\\\" + (letStr(ast));
        case 'anno':
          return "\\@" + (getAnnoName(ast)) + " " + (getAnnoData(ast)) + " . " + (astString(getAnnoBody(ast)));
      }
    };
    letStr = function(ast) {
      var binding, body;
      body = getLetBody(ast);
      binding = "(" + (getLetName(ast)) + " = " + (astString(getLetValue(ast))) + ")";
      if (body instanceof Leisure_let) {
        return binding + " " + (letStr(body));
      } else {
        return binding + " . " + (astString(body));
      }
    };
    Leisure_list = (function(superClass) {
      extend(Leisure_list, superClass);

      function Leisure_list() {
        return Leisure_list.__super__.constructor.apply(this, arguments);
      }

      Leisure_list.prototype.head = function() {
        throw new Error("Not Implemented");
      };

      Leisure_list.prototype.tail = function() {
        throw new Error("Not Implemented");
      };

      Leisure_list.prototype.isNil = function() {
        return false;
      };

      Leisure_list.prototype.find = function(func) {
        if (func(this.head())) {
          return this.head();
        } else {
          return this.tail().find(func);
        }
      };

      Leisure_list.prototype.removeAll = function(func) {
        var t;
        t = this.tail().removeAll(func);
        if (func(this.head())) {
          return t;
        } else if (t === this.tail()) {
          return this;
        } else {
          return cons(this.head(), t);
        }
      };

      Leisure_list.prototype.map = function(func) {
        return cons(func(this.head()), this.tail().map(func));
      };

      Leisure_list.prototype.foldl = function(func, arg) {
        return this.tail().foldl(func, func(arg, this.head()));
      };

      Leisure_list.prototype.foldl1 = function(func) {
        return this.tail().foldl(func, this.head());
      };

      Leisure_list.prototype.foldr = function(func, arg) {
        return func(this.head(), this.tail().foldr(func, arg));
      };

      Leisure_list.prototype.foldr1 = function(func) {
        if (this.tail() === Nil) {
          return this.head();
        } else {
          return func(this.head(), this.tail().foldr1(func));
        }
      };

      Leisure_list.prototype.toArray = function() {
        var cur, res;
        res = [];
        cur = this;
        while (!cur.isNil()) {
          res.push(cur.head());
          cur = cur.tail();
        }
        return res;
      };

      Leisure_list.prototype.join = function(str) {
        return this.toArray().join(str);
      };

      Leisure_list.prototype.intersperse = function(item) {
        return cons(this.head(), this.tail().foldr((function(el, res) {
          return cons(item, cons(el, res));
        }), Nil));
      };

      Leisure_list.prototype.reverse = function() {
        return this.rev(Nil);
      };

      Leisure_list.prototype.rev = function(result) {
        return this.tail().rev(cons(this.head(), result));
      };

      Leisure_list.prototype.elementString = function() {
        var ref2;
        return "" + (((ref2 = this.head()) != null ? ref2.constructor : void 0) === this.constructor || this.head() instanceof Leisure_nil ? '[' + this.head().elementString() + ']' : this.head()) + (this.tail() instanceof Leisure_nil ? '' : this.tail() instanceof Leisure_list ? " " + (this.tail().elementString()) : " | " + (this.tail()));
      };

      Leisure_list.prototype.equals = function(other) {
        return this === other || (other instanceof Leisure_list && consEq(this.head(), other.head()) && consEq(this.tail(), other.tail()));
      };

      Leisure_list.prototype.each = function(block) {
        block(this.head());
        return this.tail().each(block);
      };

      Leisure_list.prototype.last = function() {
        var t;
        t = this.tail();
        if (t === Nil) {
          return this.head();
        } else {
          return t.last();
        }
      };

      Leisure_list.prototype.append = function(l) {
        return cons(this.head(), this.tail().append(l));
      };

      Leisure_list.prototype.toString = function() {
        return (this.stringName()) + "[" + (this.elementString()) + "]";
      };

      Leisure_list.prototype.stringName = function() {
        return "list";
      };

      return Leisure_list;

    })(Leisure_sequence);
    declareTypeFunc('list', Leisure_list);
    consEq = function(a, b) {
      return a === b || (a instanceof Leisure_list && a.equals(b));
    };
    Leisure_cons = (function(superClass) {
      extend(Leisure_cons, superClass);

      function Leisure_cons() {
        return Leisure_cons.__super__.constructor.apply(this, arguments);
      }

      Leisure_cons.prototype.head = function() {
        return this(function() {
          return function(a) {
            return function(b) {
              return rz(a);
            };
          };
        });
      };

      Leisure_cons.prototype.tail = function() {
        return this(function() {
          return function(a) {
            return function(b) {
              return rz(b);
            };
          };
        });
      };

      Leisure_cons.prototype.stringName = function() {
        return "Cons";
      };

      return Leisure_cons;

    })(Leisure_list);
    types.cons = global.Leisure_cons = Leisure_cons;
    Leisure_nil = (function(superClass) {
      extend(Leisure_nil, superClass);

      function Leisure_nil() {
        return Leisure_nil.__super__.constructor.apply(this, arguments);
      }

      Leisure_nil.prototype.isNil = function() {
        return true;
      };

      Leisure_nil.prototype.find = function() {
        return this;
      };

      Leisure_nil.prototype.removeAll = function() {
        return this;
      };

      Leisure_nil.prototype.map = function(func) {
        return Nil;
      };

      Leisure_nil.prototype.foldl = function(func, arg) {
        return arg;
      };

      Leisure_nil.prototype.foldr = function(func, arg) {
        return arg;
      };

      Leisure_nil.prototype.reverse = function() {
        return this;
      };

      Leisure_nil.prototype.rev = function(result) {
        return result;
      };

      Leisure_nil.prototype.equals = function(other) {
        return other instanceof Leisure_nil;
      };

      Leisure_nil.prototype.each = function() {};

      Leisure_nil.prototype.toArray = function() {
        return [];
      };

      Leisure_nil.prototype.join = function() {
        return '';
      };

      Leisure_nil.prototype.append = function(l) {
        return l;
      };

      Leisure_nil.prototype.toString = function() {
        return "Cons[]";
      };

      Leisure_nil.prototype.elementString = function() {
        return '';
      };

      return Leisure_nil;

    })(Leisure_list);
    types.nil = global.Leisure_nil = Leisure_nil;
    jsType = function(v) {
      var t;
      t = typeof v;
      if (t === 'object') {
        return v.constructor || t;
      } else {
        return t;
      }
    };
    mkProto = function(protoFunc, value) {
      value.__proto__ = protoFunc.prototype;
      return value;
    };
    throwError = function(msg) {
      throw (msg instanceof Error ? msg : new Error(String(msg)));
    };
    checkType = function(value, type) {
      if (!(value instanceof type)) {
        return throwError("Type error: expected type: " + type + ", but got: " + (jsType(value)));
      }
    };
    primCons = setDataType((function(a) {
      return function(b) {
        return mkProto(Leisure_cons, setType((function(f) {
          return rz(f)(a)(b);
        }), 'cons'));
      };
    }), 'cons');
    Nil = mkProto(Leisure_nil, setDataType(setType((function(a) {
      return function(b) {
        return rz(b);
      };
    }), 'nil'), 'nil'));
    cons = function(a, b) {
      return primCons(lz(a))(lz(b));
    };
    foldLeft = function(func, val, thing) {
      if (thing instanceof Leisure_cons) {
        return thing.foldl(func, val);
      } else {
        return primFoldLeft(func, val, thing, 0);
      }
    };
    primFoldLeft = function(func, val, array, index) {
      if (index < array.length) {
        return primFoldLeft(func, func(val, array[index]), array, index + 1);
      } else {
        return val;
      }
    };
    global.leisureFuncs = {};
    global.leisureFuncNames = Nil;
    leisureAddFunc = global.leisureAddFunc = function(nm) {
      return global.leisureFuncNames = cons(nm, global.leisureFuncNames);
    };
    root.evalFunc = evalFunc = eval;
    root.functionCount = 0;
    nameFunc = function(func, name) {
      var f;
      f = null;
      return function() {
        if (f === null) {
          f = rz(func);
          if (typeof f === 'function') {
            f.leisureName = name;
          }
          return f;
        } else {
          return f;
        }
      };
    };
    global.LeisureNameSpaces = {
      core: {},
      parser: {}
    };
    isPartial = function(args) {
      return args.callee.length !== args.length;
    };
    partialCall = function(args) {
      return Leisure_primCall(args.callee, 0, args);
    };
    doPartial = function(args) {
      if (isPartial(args)) {
        return Leisure_primCall(args.callee, 0, args);
      }
    };
    define = function(name, func, arity, src, method, namespace, isNew) {
      func.leisureName = name;
      arity = arity != null ? arity : (typeof func === 'function' && func.length) || 0;
      return nakedDefine(name, lz(func), arity, src, method, namespace, isNew || (arity > 1));
    };
    nakedDefine = function(name, func, arity, src, method, namespace, isNew, redef) {
      var namedFunc, nm;
      if (!redef && functionInfo[name]) {
        redefined[name] = true;
      }
      functionInfo[name] = {
        src: src,
        arity: arity,
        leisureName: name,
        alts: {},
        altList: []
      };
      if (isNew) {
        functionInfo[name].newArity = true;
      }
      nm = 'L_' + nameSub(name);
      if (!method && global.noredefs && (global[nm] != null) && global[nm].typeFunc) {
        throwError("[DEF] Attempt to redefine definition: " + name);
      }
      functionInfo[name].def = namedFunc = typeof func === 'function' && func.memo ? (func.leisureLength = arity || func.length, func.leisureName = name, func.__proto__ === Function.prototype ? func.__proto__ = LeisureObject : void 0, func) : nameFunc(func, name);
      if (LeisureObject.prototype[nm]) {
        LeisureObject.prototype[nm] = namedFunc;
      } else {
        global[nm] = global.leisureFuncs[nm] = functionInfo[name].mainDef = namedFunc;
      }
      if (root.currentNameSpace) {
        LeisureNameSpaces[namespace != null ? namespace : root.currentNameSpace][nameSub(name)] = namedFunc;
        nsLog("DEFINING " + name + " FOR " + root.currentNameSpace);
      }
      leisureAddFunc(name);
      root.functionCount++;
      return func;
    };
    L_lit = setDataType((function(_x) {
      return function(_r) {
        return setType((function(_f) {
          return rz(_f)(_x)(_r);
        }), 'lit');
      };
    }), 'lit');
    L_ref = setDataType((function(_x) {
      return function(_r) {
        return setType((function(_f) {
          return rz(_f)(_x)(_r);
        }), 'ref');
      };
    }), 'ref');
    L_lambda = setDataType((function(_v) {
      return function(_f) {
        return function(_r) {
          return setType((function(_g) {
            return rz(_g)(_v)(_f)(_r);
          }), 'lambda');
        };
      };
    }), 'lambda');
    L_let = setDataType((function(_n) {
      return function(_v) {
        return function(_b) {
          return function(_r) {
            return setType((function(_f) {
              return rz(_f)(_n)(_v)(_b)(_r);
            }), 'let');
          };
        };
      };
    }), 'let');
    L_apply = setDataType((function(_func) {
      return function(_arg) {
        return setType((function(_f) {
          return rz(_f)(_func)(_arg);
        }), 'apply');
      };
    }), 'apply');
    L_anno = setDataType((function(_name) {
      return function(_data) {
        return function(_body) {
          return setType((function(_f) {
            return rz(_f)(_name)(_data)(_body);
          }), 'anno');
        };
      };
    }), 'anno');
    getType = function(f) {
      var ref2, t;
      t = typeof f;
      if (t === 'string' || t === 'number') {
        return t;
      } else if (t === 'undefined') {
        return "undefined";
      } else if (f.leisureType) {
        return f.leisureType;
      } else if (t === 'function' && (f != null ? f.type : void 0)) {
        return f.type;
      } else {
        return "*" + (((t === 'object') && ((ref2 = f.constructor) != null ? ref2.name : void 0)) || t);
      }
    };
    define('getType', (function(value) {
      return getType(rz(value));
    }), 1);
    getDataType = function(f) {
      return (typeof f === 'function' && f.dataType) || (f != null ? f.leisureDataType : void 0) || '';
    };
    define('getDataType', (function(value) {
      return getDataType(rz(value));
    }), 1);
    save = {};
    save.lit = lit = function(l, range) {
      return L_lit(lz(l))(lz(range));
    };
    save.ref = ref = function(r, range) {
      return L_ref(lz(r))(lz(range));
    };
    save.lambda = lambda = function(v, body, range) {
      return L_lambda(lz(v))(lz(body))(lz(range));
    };
    save.llet = llet = function(n, v, b, range) {
      return L_let(lz(n))(lz(v))(lz(b))(lz(range));
    };
    save.apply = apply = function(f, a) {
      return L_apply(lz(f))(lz(a));
    };
    save.anno = anno = function(name, data, body) {
      return L_anno(lz(name))(lz(data))(lz(body));
    };
    save.cons = cons;
    dummyPosition = cons(1, cons(0, Nil));
    getPos = function(ast) {
      switch (getType(ast)) {
        case 'lit':
          return getLitRange(ast);
        case 'ref':
          return getRefRange(ast);
        case 'lambda':
          return getLambdaRange(ast);
        case 'apply':
          return getApplyRange(ast);
        case 'let':
          return getLetRange(ast);
        case 'anno':
          return getAnnoRange(ast);
      }
    };
    firstRange = function(a, b) {
      var colA, colB, lineA, lineB, ref2, ref3;
      if (!a || !b) {
        console.log("NIL = " + Nil);
      }
      ref2 = a.toArray(), lineA = ref2[0], colA = ref2[1];
      ref3 = b.toArray(), lineB = ref3[0], colB = ref3[1];
      if ((lineA != null) && (lineB != null)) {
        if (lineA < lineB || (lineA === lineB && colA < colB)) {
          return a;
        } else {
          return b;
        }
      } else if (lineA) {
        return a;
      } else {
        return b;
      }
    };
    getLitVal = function(lt) {
      return lt(lz(function(v) {
        return function(r) {
          return rz(v);
        };
      }));
    };
    getLitRange = function(lt) {
      return lt(lz(function(v) {
        return function(r) {
          return rz(r);
        };
      }));
    };
    getRefName = function(rf) {
      return rf(lz(function(v) {
        return function(r) {
          return rz(v);
        };
      }));
    };
    getRefRange = function(rf) {
      return rf(lz(function(v) {
        return function(r) {
          return rz(r);
        };
      }));
    };
    getLambdaVar = function(lam) {
      return lam(lz(function(v) {
        return function(b) {
          return function(r) {
            return rz(v);
          };
        };
      }));
    };
    getLambdaBody = function(lam) {
      return lam(lz(function(v) {
        return function(b) {
          return function(r) {
            return rz(b);
          };
        };
      }));
    };
    getLambdaRange = function(lam) {
      return lam(lz(function(v) {
        return function(b) {
          return function(r) {
            return rz(r);
          };
        };
      }));
    };
    getLetName = function(lt) {
      return lt(lz(function(n) {
        return function(v) {
          return function(b) {
            return function(r) {
              return rz(n);
            };
          };
        };
      }));
    };
    getLetValue = function(lt) {
      return lt(lz(function(n) {
        return function(v) {
          return function(b) {
            return function(r) {
              return rz(v);
            };
          };
        };
      }));
    };
    getLetBody = function(lt) {
      return lt(lz(function(n) {
        return function(v) {
          return function(b) {
            return function(r) {
              return rz(b);
            };
          };
        };
      }));
    };
    getLetRange = function(lt) {
      return lt(lz(function(n) {
        return function(v) {
          return function(b) {
            return function(r) {
              return rz(r);
            };
          };
        };
      }));
    };
    getApplyFunc = function(apl) {
      return apl(lz(function(a) {
        return function(b) {
          return rz(a);
        };
      }));
    };
    getApplyArg = function(apl) {
      return apl(lz(function(a) {
        return function(b) {
          return rz(b);
        };
      }));
    };
    getApplyRange = function(apl) {
      return firstRange(getPos(getApplyFunc(apl)), getPos(getApplyArg(apl)));
    };
    getAnnoName = function(anno) {
      return anno(lz(function(name) {
        return function(data) {
          return function(body) {
            return rz(name);
          };
        };
      }));
    };
    getAnnoData = function(anno) {
      return anno(lz(function(name) {
        return function(data) {
          return function(body) {
            return rz(data);
          };
        };
      }));
    };
    getAnnoBody = function(anno) {
      return anno(lz(function(name) {
        return function(data) {
          return function(body) {
            return rz(body);
          };
        };
      }));
    };
    getAnnoRange = function(anno) {
      return getPos(getAnnoBody(anno));
    };
    jsonToRange = function(json) {
      return lz(consFrom(json));
    };
    rangeToJson = function(range) {
      return range.toArray();
    };
    json2AstEncodings = {
      lit: function(json) {
        return L_lit(lz(json.value))(jsonToRange(json.range));
      },
      ref: function(json) {
        return L_ref(lz(json.varName))(jsonToRange(json.range));
      },
      lambda: function(json) {
        return L_lambda(lz(json.varName))(lz(json2Ast(json.body)))(jsonToRange(json.range));
      },
      "let": function(json) {
        return L_let(lz(json.varName))(lz(json2Ast(json.value)))(lz(json2Ast(json.body)))(jsonToRange(json.range));
      },
      apply: function(json) {
        return L_apply(lz(json2Ast(json.func)))(lz(json2Ast(json.arg)));
      },
      anno: function(json) {
        return L_anno(lz(json.name))(lz(json2Ast(json.data)))(lz(json2Ast(json.body)));
      },
      cons: function(json) {
        return save.cons(json2Ast(json.head), json2Ast(json.tail));
      },
      nil: function(json) {
        return Nil;
      }
    };
    lit = save.lit;
    ref = save.ref;
    lambda = save.lambda;
    apply = save.apply;
    llet = save.llet;
    anno = save.anno;
    cons = save.cons;
    json2Ast = function(json) {
      if (typeof json === 'object') {
        return json2AstEncodings[json._type](json);
      } else {
        return json;
      }
    };
    ast2JsonEncodings = {
      Leisure_lit: function(ast) {
        return {
          _type: 'lit',
          value: getLitVal(ast),
          range: rangeToJson(getLitRange(ast))
        };
      },
      Leisure_ref: function(ast) {
        return {
          _type: 'ref',
          varName: getRefName(ast),
          range: rangeToJson(getRefRange(ast))
        };
      },
      Leisure_lambda: function(ast) {
        return {
          _type: 'lambda',
          varName: getLambdaVar(ast),
          body: ast2Json(getLambdaBody(ast)),
          range: rangeToJson(getLambdaRange(ast))
        };
      },
      Leisure_let: function(ast) {
        return {
          _type: 'let',
          varName: getLetName(ast),
          value: ast2Json(getLetValue(ast)),
          body: ast2Json(getLetBody(ast)),
          range: rangeToJson(getLetRange(ast))
        };
      },
      Leisure_apply: function(ast) {
        return {
          _type: 'apply',
          func: ast2Json(getApplyFunc(ast)),
          arg: ast2Json(getApplyArg(ast))
        };
      },
      Leisure_anno: function(ast) {
        return {
          _type: 'anno',
          name: getAnnoName(ast),
          data: ast2Json(getAnnoData(ast)),
          body: ast2Json(getAnnoBody(ast))
        };
      },
      Leisure_cons: function(ast) {
        return {
          _type: 'cons',
          head: ast2Json(ast.head()),
          tail: ast2Json(ast.tail())
        };
      },
      Leisure_nil: function(ast) {
        return {
          _type: 'nil'
        };
      }
    };
    ast2Json = function(ast) {
      var ref2;
      if (ast2JsonEncodings[(ref2 = ast.constructor) != null ? ref2.name : void 0]) {
        return ast2JsonEncodings[ast.constructor.name](ast);
      } else {
        return ast;
      }
    };
    define('json2Ast', (function(json) {
      return json2Ast(JSON.parse(rz(json)));
    }), null, null, null, 'parser');
    define('ast2Json', (function(ast) {
      return JSON.stringify(ast2Json(rz(ast)));
    }), null, null, null, 'parser');
    consFrom = function(array, i) {
      i = i || 0;
      if (i < array.length) {
        return cons(array[i], consFrom(array, i + 1));
      } else {
        return Nil;
      }
    };
    head = function(l) {
      return l.head();
    };
    tail = function(l) {
      return l.tail();
    };
    root.head = head;
    root.tail = tail;
    root.consFrom = consFrom;
    root.nameSub = nameSub;
    root.setDataType = setDataType;
    root.setType = setType;
    root.mkProto = mkProto;
    root.Nil = Nil;
    root.cons = cons;
    root.primCons = primCons;
    root.define = define;
    root.nakedDefine = nakedDefine;
    root.getType = getType;
    root.getDataType = getDataType;
    root.lit = lit;
    root.ref = ref;
    root.lambda = lambda;
    root.apply = apply;
    root.anno = anno;
    root.llet = llet;
    root.getRefName = getRefName;
    root.getRefRange = getRefRange;
    root.getLitVal = getLitVal;
    root.getLambdaBody = getLambdaBody;
    root.getLambdaVar = getLambdaVar;
    root.getApplyFunc = getApplyFunc;
    root.getApplyArg = getApplyArg;
    root.getLetName = getLetName;
    root.getLetValue = getLetValue;
    root.getLetBody = getLetBody;
    root.getAnnoName = getAnnoName;
    root.getAnnoData = getAnnoData;
    root.getAnnoBody = getAnnoBody;
    root.throwError = throwError;
    root.foldLeft = foldLeft;
    root.LeisureObject = LeisureObject;
    root.evalFunc = evalFunc;
    root.json2Ast = json2Ast;
    root.ast2Json = ast2Json;
    root.Leisure_lit = Leisure_lit;
    root.Leisure_ref = Leisure_ref;
    root.Leisure_lambda = Leisure_lambda;
    root.Leisure_apply = Leisure_apply;
    root.Leisure_let = Leisure_let;
    root.Leisure_anno = Leisure_anno;
    root.ensureLeisureClass = ensureLeisureClass;
    root.functionInfo = functionInfo;
    root.redefined = redefined;
    root.getPos = getPos;
    root.dummyPosition = dummyPosition;
    root.isNil = isNil;
    root.isPartial = isPartial;
    root.partialCall = partialCall;
    root.doPartial = doPartial;
    root.leisureFunctionNamed = leisureFunctionNamed;
    root.rangeToJson = rangeToJson;
    root.classNameForType = classNameForType;
    root.classForType = classForType;
    root.types = types;
    root.declareTypeFunc = declareTypeFunc;
    return root;
  });

}).call(this);

//# sourceMappingURL=ast.js.map
