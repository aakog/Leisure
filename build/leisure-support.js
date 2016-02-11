// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./base', './ast', './runtime', './gen', './eval', './org'], function(Base, Ast, Runtime, Gen, Eval, Org) {
    var Monad2, Nil, Node, _false, _identity, _true, _unit, acons, baseElements, baseStrokeWidth, cons, createNode, currentDataChange, defaultEnv, define, doPartial, evalLeisure, foldLeft, getMaxStrokeWidth, getSvgElement, getType, getValue, isNil, isPartial, jsonConvert, lazy, lc, lz, makeHamt, makeSyncMonad, newConsFrom, none, parseCodeAttributes, partialCall, primFoldLeft, primSvgMeasure, ref, resolve, root, runMonad2, rz, setValue, some, svgBetterMeasure, svgMeasure, svgMeasureText, transformStrokeWidth, unescapePresentationHtml;
    ref = root = Ast, define = ref.define, getType = ref.getType, cons = ref.cons, unescapePresentationHtml = ref.unescapePresentationHtml, isNil = ref.isNil, isPartial = ref.isPartial, partialCall = ref.partialCall, doPartial = ref.doPartial, Nil = ref.Nil;
    Node = Base.Node, resolve = Base.resolve, lazy = Base.lazy, defaultEnv = Base.defaultEnv;
    rz = resolve;
    lz = lazy;
    lc = Leisure_call;
    runMonad2 = Runtime.runMonad2, newConsFrom = Runtime.newConsFrom, setValue = Runtime.setValue, getValue = Runtime.getValue, makeSyncMonad = Runtime.makeSyncMonad, makeHamt = Runtime.makeHamt, _true = Runtime._true, _false = Runtime._false, _identity = Runtime._identity, _unit = Runtime._unit, jsonConvert = Runtime.jsonConvert, Monad2 = Runtime.Monad2, some = Runtime.some, none = Runtime.none, acons = Runtime.lacons;
    evalLeisure = Eval.evalLeisure;
    parseCodeAttributes = Org.parseCodeAttributes;
    currentDataChange = null;
    getSvgElement = function(id) {
      var el, svg;
      if ((el = document.getElementById(id))) {
        return el;
      } else {
        svg = createNode("<svg id='HIDDEN_SVG' xmlns='http://www.w3.org/2000/svg' version='1.1' style='top: -100000px; position: absolute'><text id='HIDDEN_TEXT'>bubba</text></svg>");
        document.body.appendChild(svg);
        return document.getElementById(id);
      }
    };
    svgMeasureText = function(text) {
      return function(style) {
        return function(f) {
          var bx, txt;
          txt = getSvgElement('HIDDEN_TEXT');
          if (rz(style)) {
            txt.setAttribute('style', rz(style));
          }
          txt.lastChild.textContent = rz(text);
          bx = txt.getBBox();
          return rz(f)(lz(bx.width))(lz(bx.height));
        };
      };
    };
    svgMeasure = function(content) {
      return primSvgMeasure(content, baseStrokeWidth);
    };
    svgBetterMeasure = function(content) {
      return primSvgMeasure(content, transformStrokeWidth);
    };
    primSvgMeasure = function(content, transformFunc) {
      return function(f) {
        var bbox, g, pad, svg;
        svg = createNode("<svg xmlns='http://www.w3.org/2000/svg' version='1.1' style='top: -100000'><g>" + content + "</g></svg>");
        document.body.appendChild(svg);
        g = svg.firstChild;
        bbox = g.getBBox();
        pad = getMaxStrokeWidth(g, g, svg, transformFunc);
        document.body.removeChild(svg);
        return rz(f)(lz(bbox.x - Math.ceil(pad / 2)))(lz(bbox.y - Math.ceil(pad / 2)))(lz(bbox.width + pad))(lz(bbox.height + pad));
      };
    };
    baseElements = ['path', 'rect', 'circle', 'ellipse', 'line', 'polyline', 'polygon'];
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
    getMaxStrokeWidth = function(el, base, svg, transformFunc) {
      var ref1, ref2;
      if (ref1 = base.nodeName, indexOf.call(baseElements, ref1) >= 0) {
        svg.setAttribute('width', (ref2 = getComputedStyle(base).strokeWidth) != null ? ref2 : '0', svg);
        return transformFunc(el, svg.width.baseVal.value);
      } else if (base.nodeName === 'use') {
        return getMaxStrokeWidth(base, base.instanceRoot.correspondingElement, svg, transformFunc);
      } else if (base.nodeName === 'g') {
        return foldLeft((function(v, n) {
          return Math.max(v, getMaxStrokeWidth(n, n, svg, transformFunc));
        }), 0, el.childNodes);
      } else {
        return 0;
      }
    };
    baseStrokeWidth = function(el, w) {
      return w;
    };
    transformStrokeWidth = function(el, w) {
      var ctm, tp1, tp2, x, y;
      if (w === 0) {
        return 0;
      } else {
        ctm = el.getScreenCTM();
        tp1 = transformedPoint(pt, bx.x - Math.ceil(w), bx.y - Math.ceil(w), ctm, isctm);
        tp2 = transformedPoint(pt, bx.x + bx.width + Math.ceil(w), bx.y + bx.height + Math.ceil(w), ctm, isctm);
        x = tp2.x - tp1.x;
        y = tp2.y - tp1.y;
        return Math.sqrt(x * x + y * y);
      }
    };
    createNode = function(txt) {
      var scratch;
      scratch = document.createElement('DIV');
      scratch.innerHTML = txt;
      return scratch.firstChild;
    };
    define('svgMeasure', (function(content) {
      return svgMeasure(rz(content));
    }), 1);
    define('svgMeasureText', (function(text) {
      return svgMeasureText(rz(text));
    }), 1);
    define('dataMod', setDataType((function(op) {
      var m;
      m = new Monad2(function(env, cont) {
        var data;
        data = {};
        return runMods(env, rz(op), data, cont, true);
      });
      m.op = op;
      m.leisureType = 'dataMod';
      return m;
    }), 'dataMod'));
    define('dataModOperation', function(mod) {
      return rz((rz(mod)).op);
    });
    define('setTheme', function(theme) {
      return new Monad2(function(env, cont) {
        env.opts.setTheme(theme);
        return cont(_unit);
      });
    });
    define('_changeData', function(changes) {
      return new Monad2('changeData', function(env, cont) {
        if (env.opts.dataChanges) {
          throw new Error("Attempt to change data while already changing data!");
        }
        return env.opts.changeData(function() {
          currentDataChange = {};
          return runMonad2(rz(changes), env, function(x) {
            return x;
          });
        }).then(function(x) {
          return cont(x);
        });
      });
    });
    define('getData', function(name) {
      return new Monad2('getData', function(env, cont) {
        var d;
        d = env.opts.getData(rz(name), true);
        if (d) {
          currentDataChange[rz(name)] = d;
          return cont(some(jsonConvert(d)));
        } else {
          return cont(none);
        }
      });
    });
    define('_setData', function(name, value) {
      var r;
      if (r = doPartial(arguments)) {
        return r;
      } else {
        return new Monad2('setData', function(env, cont) {
          return cont(jsonConvert(env.opts.setData(rz(name), rz(value))));
        });
      }
    });
    define('_appendData', function(headline, name, value) {
      var r;
      if (r = doPartial(arguments)) {
        return r;
      } else {
        return new Monad2('appendData', function(env, cont) {
          env.opts.appendDataToHeadline(rz(headline), rz(name), rz(value));
          return cont(jsonConvert(rz(value)));
        });
      }
    });
    define('_appendDataWithAttrs', function(headline, name, attrs, value) {
      var r;
      if (r = doPartial(arguments)) {
        return r;
      } else {
        return new Monad2('appendDataWithAttrs', function(env, cont) {
          env.opts.appendDataToHeadline(rz(headline), !isNil(rz(name)) && rz(name), rz(value), parseCodeAttributes(rz(attrs)));
          return cont(jsonConvert(rz(value)));
        });
      }
    });
    define('removeData', function(name) {
      return new Monad2('removeData', function(env, cont) {
        env.opts.removeData(rz(name));
        return cont(_unit);
      });
    });
    return evalLeisure("defMacro 'changeData' \\list . ['_changeData' ['do' | list]]\nsetData name data = _setData name (toJson data)\nappendData headline name data = _appendData headline name (toJson data)\nappendDataWithAttrs headline name attrs data = _appendDataWithAttrs headline name attrs (toJson data)");
  });

}).call(this);

//# sourceMappingURL=leisure-support.js.map
