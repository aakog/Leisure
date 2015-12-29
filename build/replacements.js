// Generated by CoffeeScript 1.9.3
(function() {
  var slice = [].slice;

  define(['./lib/fingertree', './lib/lodash.min', './testing', 'immutable', './export'], function(Fingertree, _, Testing, Immutable, Exports) {
    var Replacements, Set, assert, assertEq, diag, eachReplacement, mergeExports, mergeRepl, replacements;
    assert = Testing.assert, assertEq = Testing.assertEq;
    Set = Immutable.Set;
    mergeExports = Exports.mergeExports;
    diag = function() {
      var args;
      args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    };
    Replacements = (function() {
      function Replacements(reps) {
        this.replacements = reps != null ? reps : Fingertree.fromArray([], {
          identity: function() {
            return {
              initial: 0,
              final: 0,
              float: 0
            };
          },
          measure: function(n) {
            return {
              initial: n.offset + n.length,
              final: n.offset + n.text.length,
              float: n.text.length - n.length
            };
          },
          sum: function(a, b) {
            return {
              initial: a.initial + b.initial,
              final: a.final + b.final,
              float: a.float + b.float
            };
          }
        });
      }

      Replacements.prototype.snapshot = function() {
        return new Replacements(this.replacements);
      };

      Replacements.prototype.isEmpty = function() {
        return this.replacements.isEmpty();
      };

      Replacements.prototype.initialBounds = function() {
        if (this.isEmpty()) {
          return {
            start: 0,
            end: 0
          };
        } else {
          return {
            start: this.replacements.peekFirst().offset,
            end: this.replacements.measure().initial
          };
        }
      };

      Replacements.prototype.finalBounds = function() {
        if (this.isEmpty()) {
          return {
            start: 0,
            end: 0
          };
        } else {
          return {
            start: this.replacements.peekFirst().offset,
            end: this.replacements.measure().final
          };
        }
      };

      Replacements.prototype.measure = function() {
        return this.replacements.measure();
      };

      Replacements.prototype.floatFor = function(offset) {
        return this.replacements.split(function(m) {
          return m.initial > offset;
        })[0].measure().float;
      };

      Replacements.prototype.addFloat = function(start, float) {
        var first, l, n, ref, rest;
        ref = this.replacements.split(function(m) {
          return m.final >= start;
        }), first = ref[0], rest = ref[1];
        l = first.measure().final;
        if (!rest.isEmpty()) {
          n = rest.peekFirst();
          rest = rest.removeFirst().addFirst(_.defaults({
            offset: n.offset + float
          }, n));
          return this.replacements = first.concat(rest);
        }
      };

      Replacements.prototype.replace = function(repl) {
        var end, first, l, next, node, old, ref, ref1, rest, start, text;
        start = repl.start, end = repl.end, text = repl.text;
        ref = this.replacements.split(function(m) {
          return m.final >= start;
        }), first = ref[0], rest = ref[1];
        l = first.measure().final;
        if (!rest.isEmpty() && l + (old = rest.peekFirst()).offset <= end) {
          node = mergeRepl(l, old, repl);
          rest = rest.removeFirst();
        } else {
          node = {
            offset: repl.start - l,
            length: repl.end - repl.start,
            text: text,
            labels: (ref1 = repl.labels) != null ? ref1 : []
          };
          if (!rest.isEmpty()) {
            next = rest.peekFirst();
            rest = rest.removeFirst().addFirst(_.defaults({
              offset: next.offset + l - repl.end
            }, next));
          }
        }
        this.replacements = first.concat(rest.addFirst(node));
        return old != null ? old.repl : void 0;
      };

      Replacements.prototype.dump = function() {
        return console.log(this.toString());
      };

      Replacements.prototype.toString = function() {
        var strs;
        strs = [];
        this.eachOperation(function(start, end, text) {
          return strs.push(start + ", " + end + ", " + (JSON.stringify(text)));
        });
        return strs.join('\n');
      };

      Replacements.prototype.toConcurrent = function(conc) {
        conc = conc != null ? conc : new ConcurrentReplacements();
        this.eachOperation(function(start, end, text, cookies) {
          return conc.replace({
            start: start,
            end: end,
            text: text,
            cookies: cookies
          });
        });
        return conc;
      };

      Replacements.prototype.eachOperation = function(func) {
        var n, start, t;
        t = this.replacements;
        while (!t.isEmpty()) {
          n = t.peekLast();
          t = t.removeLast();
          start = t.measure().initial + n.offset;
          func(start, start + n.length, n.text, n.labels, n);
        }
        return null;
      };

      Replacements.prototype.merge = function(replacements) {
        return replacements.eachOperation((function(_this) {
          return function(start, end, text, labels) {
            return _this.replace({
              start: start,
              end: end,
              text: text,
              labels: labels
            });
          };
        })(this));
      };

      Replacements.prototype.toArray = function() {
        var j, label, len, n, ref, results, start, t;
        results = [];
        t = this.replacements;
        while (!t.isEmpty()) {
          n = t.peekFirst();
          t = t.removeFirst();
          start = t.measure().initial + n.offset;
          results.push(start, start + n.length, n.text);
          ref = n.labels;
          for (j = 0, len = ref.length; j < len; j++) {
            label = ref[j];
            results.push(label);
          }
        }
        return results;
      };

      Replacements.prototype.getRepls = function() {
        var repls;
        repls = [];
        this.eachOperation(function(start, end, text) {
          return repls.push({
            start: start,
            end: end,
            text: text
          });
        });
        return repls;
      };

      return Replacements;

    })();
    eachReplacement = function(reps, func) {
      var end, i, labels, results1, start, text;
      i = 0;
      results1 = [];
      while (i < reps.length) {
        start = reps[i++];
        end = reps[i++];
        text = reps[i++];
        labels = [];
        while (typeof reps[i] === 'object') {
          labels.push(reps[i++]);
        }
        results1.push(func(start, end, text, labels));
      }
      return results1;
    };
    Replacements.fromArray = function(reps) {
      var j, len, repl, seq;
      seq = new Replacements();
      if (typeof reps[0] === 'number') {
        eachReplacement(reps, function(start, end, text, labels) {
          return seq.replace({
            start: start,
            end: end,
            text: text,
            labels: labels
          });
        });
      } else {
        for (j = 0, len = reps.length; j < len; j++) {
          repl = reps[j];
          seq.replace(repl);
        }
      }
      return seq;
    };
    mergeRepl = function(offset, node, repl) {
      var end, j, label, labels, len, newStart, rEnd, rStart, ref, start;
      start = offset + node.offset;
      end = start + node.length;
      rStart = Math.max(0, repl.start - start);
      rEnd = repl.end - start;
      newStart = Math.min(start, repl.start);
      labels = (function() {
        var j, len, ref, results1;
        if (rStart === node.text.length) {
          return node.labels.slice(0);
        } else {
          ref = node.labels;
          results1 = [];
          for (j = 0, len = ref.length; j < len; j++) {
            label = ref[j];
            results1.push({
              name: label.name,
              offset: rStart >= label.offset ? label.offset : label.offset + repl.text.length - repl.start + repl.end
            });
          }
          return results1;
        }
      })();
      if (repl.labels != null) {
        ref = repl.labels;
        for (j = 0, len = ref.length; j < len; j++) {
          label = ref[j];
          labels.push({
            name: label.name,
            offset: label.offset + rStart
          });
        }
      }
      return {
        offset: newStart - offset,
        length: end + Math.max(0, repl.end - start - node.text.length) - Math.min(repl.start, start),
        text: node.text.substring(0, rStart) + repl.text + node.text.substring(rEnd),
        labels: labels
      };
    };
    replacements = function(reps) {
      var j, len, repl, s;
      s = new Replacements();
      for (j = 0, len = reps.length; j < len; j++) {
        repl = reps[j];
        s.replace(repl);
      }
      return s;
    };
    return mergeExports({
      Replacements: {
        Replacements: Replacements,
        replacements: replacements
      }
    }).Replacements;
  });

}).call(this);

//# sourceMappingURL=replacements.js.map
