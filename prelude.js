var prelude = (function(){
var root;

if ((typeof window !== 'undefined' && window !== null) && (!(typeof global !== 'undefined' && global !== null) || global === window)) {
  prelude = root = {};
  global = window;
} else {
  root = typeof exports !== 'undefined' && exports !== null ? exports : this;
  Parse = require('./parse');
  Leisure = require('./leisure');
  require('./prim');
  ReplCore = require('./replCore');
  Repl = require('./repl');
}
root.defs = {};
root.tokenDefs = [];
root.macros = {};

Nil = Parse.Nil;
var cons = Parse.cons;
var setType = Parse.setType;
var setDataType = Parse.setDataType;
var define = Parse.define;
var processResult = Repl.processResult;
var setContext = Leisure.setContext;
var funcContext = Leisure.funcContext;
var define = Parse.define;
var _id, _flip, _true, _false, _and, _or, _not, _neq, _left, _right, _some, _some2, _none, _head, _tail, _head, _tail, _startPos, _startPos, _endPos, _endPos, _pairFunc, _pairFunc, _pairFunc, _null$e, _null$e, _foldl, _foldl, _foldl1, _foldl1, _foldr, _foldr1, _foldr1, _append, _append, __append, __append, _compose, _iszero, _positive, _length, _$_$_, _$o$o, _even$e, _odd$e, _max, _min, _reverse, _subreverse, _addstr, _if, _at, _take, __take, _takeWhile, __takeWhile, _drop, _dropWhile, _dropLast, __dropLast, _series, _from, _fromBy, _fromTo, _fromToBy, _any, __any, _all, __all, _index_combine, _indexof, _position, _find, _findIf, _findIfOpt, _count, _countIf, _countIfNot, _remove, _removeIf, __removeIf, _removeIfNot, _filter, _map, __map, _reduce, _$r, _$s, _$q, _$b, _nextListItem, _dlempty, _dl, _dlAppend, _identMacro, _macroCons, _do, _doClause, _doExtractVar, _html, _assocFromList, _assocKey, _assocValue, _assocGetPair, _assocGetPairOpt, _valueOrDefault, _assocKeys, _assocNumKeys, _assocMergeKeys, _assocMerge, _assocSet, _assocGet, _assocGetWithDefault, _assocRemove;
processResult(//AST(defGroup "[" "]")
(_defGroup()((function(){return "["}))((function(){return "]"}))));
processResult(//AST(defToken "|")
(_defToken()((function(){return "|"}))));
processResult(//AST(defToken ",")
(_defToken()((function(){return ","}))));
//id = AST(λx . x)
root.defs._id = _id = Parse.define('id', (function() {var f; return function _id(){return f || (f = (function(_x){return _x();}));}})(), 1, "\\x. x");;
//flip = AST(λf a b . f b a)
root.defs._flip = _flip = Parse.define('flip', (function() {var f; return function _flip(){return f || (f = (Parse.setDataType(function(_f){return Parse.setType(function(_a){return function(_b){return _f()(_b)(_a);};}, 'flip');}, 'flip')));}})(), 1, "\\f. \\a b . f b a");;
//true = AST(λa b . a)
root.defs._true = _true = Parse.define('true', (function() {var f; return function _true(){return f || (f = (Parse.setType(function(_a){return function(_b){return _a();};}, 'true')));}})(), 0, "\\a b . a");;
//false = AST(λa b . b)
root.defs._false = _false = Parse.define('false', (function() {var f; return function _false(){return f || (f = (Parse.setType(function(_a){return function(_b){return _b();};}, 'false')));}})(), 0, "\\a b . b");;
//and = AST(λa b . a b false)
root.defs._and = _and = Parse.define('and', (function() {var f; return function _and(){return f || (f = (function(_a){return function(_b){return _a()(_b)(_false);};}));}})(), 2, "\\a. \\b. a b false");;
//or = AST(λa . a true)
root.defs._or = _or = Parse.define('or', (function() {var f; return function _or(){return f || (f = (function(_a){return _a()(_true);}));}})(), 1, "\\a. a true");;
//not = AST(λa . a false true)
root.defs._not = _not = Parse.define('not', (function() {var f; return function _not(){return f || (f = (function(_a){return _a()(_false)(_true);}));}})(), 1, "\\a. a false true");;
//neq = AST(λa b . not (eq a b))
root.defs._neq = _neq = Parse.define('neq', (function() {var f; return function _neq(){return f || (f = (function(_a){return function(_b){return _not()((function(){var $m; return (function(){return $m || ($m = (_eq()(_a)(_b)))})})());};}));}})(), 2, "\\a. \\b. not (eq a b)");;
//left = AST(λv l r . l v)
root.defs._left = _left = Parse.define('left', (function() {var f; return function _left(){return f || (f = (Parse.setDataType(function(_v){return Parse.setType(function(_l){return function(_r){return _l()(_v);};}, 'left');}, 'left')));}})(), 1, "\\v. \\l r . l v");;
//right = AST(λv l r . r v)
root.defs._right = _right = Parse.define('right', (function() {var f; return function _right(){return f || (f = (Parse.setDataType(function(_v){return Parse.setType(function(_l){return function(_r){return _r()(_v);};}, 'right');}, 'right')));}})(), 1, "\\v. \\l r . r v");;
//some = AST(λx yes no . yes x)
root.defs._some = _some = Parse.define('some', (function() {var f; return function _some(){return f || (f = (Parse.setDataType(function(_x){return Parse.setType(function(_yes){return function(_no){return _yes()(_x);};}, 'some');}, 'some')));}})(), 1, "\\x. \\yes no . yes x");;
//some2 = AST(λa b yes no . yes a b)
root.defs._some2 = _some2 = Parse.define('some2', (function() {var f; return function _some2(){return f || (f = (Parse.setDataType(function(_a){return function(_b){return Parse.setType(function(_yes){return function(_no){return _yes()(_a)(_b);};}, 'some2');};}, 'some2')));}})(), 2, "\\a. \\b. \\yes no . yes a b");;
//none = AST(λyes no . no)
root.defs._none = _none = Parse.define('none', (function() {var f; return function _none(){return f || (f = (Parse.setType(function(_yes){return function(_no){return _no();};}, 'none')));}})(), 0, "\\yes no . no");;
//head = AST(λl . l λh t . h)
root.defs._head = _head = Leisure.makeDispatchFunction('head', '_head', '_l', ['_head', '_l']);
Leisure.createMethod('cons', 'head', "\\l. l \\h t . h", function(_l) {return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_t){return _h();};}))})})());});
//tail = AST(λl . l λh t . t)
root.defs._tail = _tail = Leisure.makeDispatchFunction('tail', '_tail', '_l', ['_tail', '_l']);
Leisure.createMethod('cons', 'tail', "\\l. l \\h t . t", function(_l) {return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_t){return _t();};}))})})());});
//head = AST(λl . l λh s t e . h)
root.defs._head = _head = Leisure.makeDispatchFunction('head', '_head', '_l', ['_head', '_l']);
Leisure.createMethod('lexCons', 'head', "\\l. l \\h s t e . h", function(_l) {return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_s){return function(_t){return function(_e){return _h();};};};}))})})());});
//tail = AST(λl . l λh s t e . t)
root.defs._tail = _tail = Leisure.makeDispatchFunction('tail', '_tail', '_l', ['_tail', '_l']);
Leisure.createMethod('lexCons', 'tail', "\\l. l \\h s t e . t", function(_l) {return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_s){return function(_t){return function(_e){return _t();};};};}))})})());});
//startPos = AST(λl . lexStart l)
root.defs._startPos = _startPos = Leisure.makeDispatchFunction('startPos', '_startPos', '_l', ['_startPos', '_l']);
Leisure.createMethod('lexCons', 'startPos', "\\l. lexStart l", function(_l) {return _lexStart()(_l);});
//startPos = AST(λt . t λt p . p)
root.defs._startPos = _startPos = Leisure.makeDispatchFunction('startPos', '_startPos', '_t', ['_startPos', '_t']);
Leisure.createMethod('token', 'startPos', "\\t. t \\t p . p", function(_t) {return _t()((function(){var $m; return (function(){return $m || ($m = (function(_t){return function(_p){return _p();};}))})})());});
//endPos = AST(λl . lexEnd l)
root.defs._endPos = _endPos = Leisure.makeDispatchFunction('endPos', '_endPos', '_l', ['_endPos', '_l']);
Leisure.createMethod('lexCons', 'endPos', "\\l. lexEnd l", function(_l) {return _lexEnd()(_l);});
//endPos = AST(λt . + (tokenStart t) (strlen (tokenName t)))
root.defs._endPos = _endPos = Leisure.makeDispatchFunction('endPos', '_endPos', '_t', ['_endPos', '_t']);
Leisure.createMethod('token', 'endPos', "\\t. + (tokenStart t) (strlen (tokenName t))", function(_t) {return _$o()((function(){var $m; return (function(){return $m || ($m = (_tokenStart()(_t)))})})())((function(){var $m; return (function(){return $m || ($m = (_strlen()((function(){var $m; return (function(){return $m || ($m = (_tokenName()(_t)))})})())))})})());});
//pairFunc = AST(λl . false)
root.defs._pairFunc = _pairFunc = Parse.define('pairFunc', (function() {var f; return function _pairFunc(){return f || (f = (function(_l){return _false();}));}})(), 1, "\\l. false");;
//pairFunc = AST(λl . cons)
root.defs._pairFunc = _pairFunc = Leisure.makeDispatchFunction('pairFunc', '_pairFunc', '_l', ['_pairFunc', '_l']);
Leisure.createMethod('cons', 'pairFunc', "\\l. cons", function(_l) {return _cons();});
//pairFunc = AST(λl h t . null? t (lexCons h (startPos h) nil (endPos h)) (lexCons h (startPos h) t (endPos t)))
root.defs._pairFunc = _pairFunc = Leisure.makeDispatchFunction('pairFunc', '_pairFunc', '_l', ['_pairFunc', '_l']);
Leisure.createMethod('lexCons', 'pairFunc', "\\l. \\h t . null? t\n  lexCons h (startPos h) nil (endPos h)\n  lexCons h (startPos h) t (endPos t)", function(_l) {return Parse.setType(function(_h){return function(_t){return _null$e()(_t)((function(){var $m; return (function(){return $m || ($m = (_lexCons()(_h)((function(){var $m; return (function(){return $m || ($m = (_startPos()(_h)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_endPos()(_h)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_lexCons()(_h)((function(){var $m; return (function(){return $m || ($m = (_startPos()(_h)))})})())(_t)((function(){var $m; return (function(){return $m || ($m = (_endPos()(_t)))})})())))})})());};}, 'pairFunc');});
//null? = AST(λx . false)
root.defs._null$e = _null$e = Parse.define('null?', (function() {var f; return function _null$e(){return f || (f = (function(_x){return _false();}));}})(), 1, "\\x. false");;
//null? = AST(λx . true)
root.defs._null$e = _null$e = Leisure.makeDispatchFunction('null?', '_null$e', '_x', ['_null$e', '_x']);
Leisure.createMethod('nil', 'null?', "\\x. true", function(_x) {return _true();});
//foldl = AST(λfunc arg list . foldl func (func arg (head list)) (tail list))
root.defs._foldl = _foldl = Parse.define('foldl', (function() {var f; return function _foldl(){return f || (f = (function(_func){return function(_arg){return function(_list){return _foldl()(_func)((function(){var $m; return (function(){return $m || ($m = (_func()(_arg)((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})());};};}));}})(), 3, "\\func. \\arg. \\list. foldl func (func arg (head list)) (tail list)");;
//foldl = AST(λfunc arg list . arg)
root.defs._foldl = _foldl = Leisure.makeDispatchFunction('foldl', '_foldl', '_list', ['_foldl', '_func', '_arg', '_list']);
Leisure.createMethod('nil', 'foldl', "\\func. \\arg. \\list. arg", function(_func, _arg, _list) {return _arg();});
//foldl1 = AST(λfunc list . foldl func (head list) (tail list))
root.defs._foldl1 = _foldl1 = Parse.define('foldl1', (function() {var f; return function _foldl1(){return f || (f = (function(_func){return function(_list){return _foldl()(_func)((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})());};}));}})(), 2, "\\func. \\list. foldl func (head list) (tail list)");;
//foldl1 = AST(λfunc list . nil)
root.defs._foldl1 = _foldl1 = Leisure.makeDispatchFunction('foldl1', '_foldl1', '_list', ['_foldl1', '_func', '_list']);
Leisure.createMethod('nil', 'foldl1', "\\func. \\list. nil", function(_func, _list) {return _nil();});
//foldr = AST(λfunc arg list . null? list arg (func (head list) (foldr func arg (tail list))))
root.defs._foldr = _foldr = Parse.define('foldr', (function() {var f; return function _foldr(){return f || (f = (function(_func){return function(_arg){return function(_list){return _null$e()(_list)(_arg)((function(){var $m; return (function(){return $m || ($m = (_func()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_foldr()(_func)(_arg)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})());};};}));}})(), 3, "\\func. \\arg. \\list. null? list\n  arg\n  func (head list) (foldr func arg (tail list))");;
//foldr1 = AST(λfunc list . eq (tail list) nil (head list) (func (head list) (foldr1 func (tail list))))
root.defs._foldr1 = _foldr1 = Parse.define('foldr1', (function() {var f; return function _foldr1(){return f || (f = (function(_func){return function(_list){return _eq()((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_func()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_foldr1()(_func)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})());};}));}})(), 2, "\\func. \\list. eq (tail list) nil\n  head list\n  func (head list) (foldr1 func (tail list))");;
//foldr1 = AST(λfunc list . nil)
root.defs._foldr1 = _foldr1 = Leisure.makeDispatchFunction('foldr1', '_foldr1', '_list', ['_foldr1', '_func', '_list']);
Leisure.createMethod('nil', 'foldr1', "\\func. \\list. nil", function(_func, _list) {return _nil();});
//append = AST(λl1 l2 . _append (pairFunc l1) l1 l2)
root.defs._append = _append = Parse.define('append', (function() {var f; return function _append(){return f || (f = (function(_l1){return function(_l2){return __append()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_l1)))})})())(_l1)(_l2);};}));}})(), 2, "\\l1. \\l2. _append (pairFunc l1) l1 l2");;
//append = AST(λl1 l2 . l2)
root.defs._append = _append = Leisure.makeDispatchFunction('append', '_append', '_l1', ['_append', '_l1', '_l2']);
Leisure.createMethod('nil', 'append', "\\l1. \\l2. l2", function(_l1, _l2) {return _l2();});
//_append = AST(λpairF l1 l2 . pairF (head l1) (_append pairF (tail l1) l2))
root.defs.__append = __append = Parse.define('_append', (function() {var f; return function __append(){return f || (f = (function(_pairF){return function(_l1){return function(_l2){return _pairF()((function(){var $m; return (function(){return $m || ($m = (_head()(_l1)))})})())((function(){var $m; return (function(){return $m || ($m = (__append()(_pairF)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l1)))})})())(_l2)))})})());};};}));}})(), 3, "\\pairF. \\l1. \\l2. pairF (head l1) (_append pairF (tail l1) l2)");;
//_append = AST(λpairF l1 l2 . l2)
root.defs.__append = __append = Leisure.makeDispatchFunction('_append', '__append', '_l1', ['__append', '_pairF', '_l1', '_l2']);
Leisure.createMethod('nil', '_append', "\\pairF. \\l1. \\l2. l2", function(_pairF, _l1, _l2) {return _l2();});
//compose = AST(λf g x . f (g x))
root.defs._compose = _compose = Parse.define('compose', (function() {var f; return function _compose(){return f || (f = (Parse.setDataType(function(_f){return function(_g){return Parse.setType(function(_x){return _f()((function(){var $m; return (function(){return $m || ($m = (_g()(_x)))})})());}, 'compose');};}, 'compose')));}})(), 2, "\\f. \\g. \\x . f ( g x)");;
//iszero = AST(eq 0)
root.defs._iszero = _iszero = Parse.define('iszero', (function _iszero() {return ((_eq()((function(){return 0}))));}), 0, "eq 0");;
//positive = AST(< 0)
root.defs._positive = _positive = Parse.define('positive', (function _positive() {return ((_$y()((function(){return 0}))));}), 0, "< 0");;
//length = AST(λl . eq l nil 0 (++ (length (tail l))))
root.defs._length = _length = Parse.define('length', (function() {var f; return function _length(){return f || (f = (function(_l){return _eq()(_l)(_nil)((function(){return 0}))((function(){var $m; return (function(){return $m || ($m = (_$o$o()((function(){var $m; return (function(){return $m || ($m = (_length()((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());}));}})(), 1, "\\l. (eq l nil) 0 (++ (length (tail l) ) )");;
//-- = AST(flip - 1)
root.defs._$_$_ = _$_$_ = Parse.define('--', (function _$_$_() {return ((_flip()(_$_)((function(){return 1}))));}), 0, "(flip -) 1");;
//++ = AST(+ 1)
root.defs._$o$o = _$o$o = Parse.define('++', (function _$o$o() {return ((_$o()((function(){return 1}))));}), 0, "+ 1");;
//even? = AST(λx . iszero (% x 2))
root.defs._even$e = _even$e = Parse.define('even?', (function() {var f; return function _even$e(){return f || (f = (function(_x){return _iszero()((function(){var $m; return (function(){return $m || ($m = (_$A()(_x)((function(){return 2}))))})})());}));}})(), 1, "\\x. iszero (% x 2)");;
//odd? = AST(λx . eq 1 (% x 2))
root.defs._odd$e = _odd$e = Parse.define('odd?', (function() {var f; return function _odd$e(){return f || (f = (function(_x){return _eq()((function(){return 1}))((function(){var $m; return (function(){return $m || ($m = (_$A()(_x)((function(){return 2}))))})})());}));}})(), 1, "\\x. eq 1 (% x 2)");;
//max = AST(λa b . gt a b a b)
root.defs._max = _max = Parse.define('max', (function() {var f; return function _max(){return f || (f = (function(_a){return function(_b){return _gt()(_a)(_b)(_a)(_b);};}));}})(), 2, "\\a. \\b. (gt a b) a b");;
//min = AST(λa b . lt a b a b)
root.defs._min = _min = Parse.define('min', (function() {var f; return function _min(){return f || (f = (function(_a){return function(_b){return _lt()(_a)(_b)(_a)(_b);};}));}})(), 2, "\\a. \\b. (lt a b) a b");;
//reverse = AST(λl . subreverse l nil)
root.defs._reverse = _reverse = Parse.define('reverse', (function() {var f; return function _reverse(){return f || (f = (function(_l){return _subreverse()(_l)(_nil);}));}})(), 1, "\\l. subreverse l nil");;
//subreverse = AST(λl result . l λh t D . subreverse t (cons h result) result)
root.defs._subreverse = _subreverse = Parse.define('subreverse', (function() {var f; return function _subreverse(){return f || (f = (function(_l){return function(_result){return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_t){return function(_D){return _subreverse()(_t)((function(){var $m; return (function(){return $m || ($m = (_cons()(_h)(_result)))})})());};};}))})})())(_result);};}));}})(), 2, "\\l. \\result. l (\\h t D . subreverse t (cons h result)) result");;
//addstr = AST(λa b . concat ([ a b ]))
root.defs._addstr = _addstr = Parse.define('addstr', (function() {var f; return function _addstr(){return f || (f = (function(_a){return function(_b){return _concat()((function(){var $m; return (function(){return $m || ($m = (_$r()(_a)(_b)(_$s)))})})());};}));}})(), 2, "\\a. \\b. concat [a b]");;
//if = AST(id)
root.defs._if = _if = Parse.define('if', (function _if() {return ((_id()));}), 0, "id");;
//at = AST(λl x . iszero x (head l) (at (tail l) (-- x)))
root.defs._at = _at = Parse.define('at', (function() {var f; return function _at(){return f || (f = (function(_l){return function(_x){return _iszero()(_x)((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_at()((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_$_$_()(_x)))})})())))})})());};}));}})(), 2, "\\l. \\x. (iszero (x)) (head l) (at (tail l) (-- (x) ) )");;
//take = AST(λn list . _take (pairFunc list) n list)
root.defs._take = _take = Parse.define('take', (function() {var f; return function _take(){return f || (f = (function(_n){return function(_list){return __take()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_list)))})})())(_n)(_list);};}));}})(), 2, "\\n. \\list. _take (pairFunc list) n list");;
//_take = AST(λpairF n list . positive n (null? list nil (pairF (head list) (_take pairF (-- n) (tail list)))) nil)
root.defs.__take = __take = Parse.define('_take', (function() {var f; return function __take(){return f || (f = (function(_pairF){return function(_n){return function(_list){return _positive()(_n)((function(){var $m; return (function(){return $m || ($m = (_null$e()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_pairF()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (__take()(_pairF)((function(){var $m; return (function(){return $m || ($m = (_$_$_()(_n)))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})())))})})())(_nil);};};}));}})(), 3, "\\pairF. \\n. \\list. positive n\n  null? list\n    nil\n    pairF (head list) (_take pairF (-- n) (tail list))\n  nil");;
//takeWhile = AST(λpredicate list . _takeWhile (pairFunc list) predicate list)
root.defs._takeWhile = _takeWhile = Parse.define('takeWhile', (function() {var f; return function _takeWhile(){return f || (f = (function(_predicate){return function(_list){return __takeWhile()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_list)))})})())(_predicate)(_list);};}));}})(), 2, "\\predicate. \\list. _takeWhile (pairFunc list) predicate list");;
//_takeWhile = AST(λpairF predicate list . null? list nil (predicate (head list) (pairF (head list) (_takeWhile pairF predicate (tail list))) nil))
root.defs.__takeWhile = __takeWhile = Parse.define('_takeWhile', (function() {var f; return function __takeWhile(){return f || (f = (function(_pairF){return function(_predicate){return function(_list){return _null$e()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_predicate()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_pairF()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (__takeWhile()(_pairF)(_predicate)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})())(_nil)))})})());};};}));}})(), 3, "\\pairF. \\predicate. \\list. null? list\n  nil\n  predicate (head list)\n    pairF (head list) (_takeWhile pairF predicate (tail list))\n    nil");;
//drop = AST(λx list . positive x (null? list nil (drop (-- x) (tail list))) list)
root.defs._drop = _drop = Parse.define('drop', (function() {var f; return function _drop(){return f || (f = (function(_x){return function(_list){return _positive()(_x)((function(){var $m; return (function(){return $m || ($m = (_null$e()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_drop()((function(){var $m; return (function(){return $m || ($m = (_$_$_()(_x)))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})())(_list);};}));}})(), 2, "\\x. \\list. positive x\n  null? list\n    nil\n    drop (-- x) (tail list)\n  list");;
//dropWhile = AST(λpredicate list . null? list nil (predicate (head list) (dropWhile predicate (tail list)) list))
root.defs._dropWhile = _dropWhile = Parse.define('dropWhile', (function() {var f; return function _dropWhile(){return f || (f = (function(_predicate){return function(_list){return _null$e()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_predicate()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_dropWhile()(_predicate)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())(_list)))})})());};}));}})(), 2, "\\predicate. \\list. null? list\n  nil\n  predicate (head list)\n    dropWhile predicate (tail list)\n    list");;
//dropLast = AST(λn list . tail (_dropLast (pairFunc list) n list))
root.defs._dropLast = _dropLast = Parse.define('dropLast', (function() {var f; return function _dropLast(){return f || (f = (function(_n){return function(_list){return _tail()((function(){var $m; return (function(){return $m || ($m = (__dropLast()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_list)))})})())(_n)(_list)))})})());};}));}})(), 2, "\\n. \\list. tail (_dropLast (pairFunc list) n list)");;
//_dropLast = AST(λpairF n list . eq list nil ([ 0 ]) ((λnext . gt n (head next) ([ (+ 1 (head next)) ]) ([ n | (pairF (head list) (tail next)) ])) (_dropLast pairF n (tail list))))
root.defs.__dropLast = __dropLast = Parse.define('_dropLast', (function() {var f; return function __dropLast(){return f || (f = (function(_pairF){return function(_n){return function(_list){return _eq()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_$r()((function(){return 0}))(_$s)))})})())((function(){var $m; return (function(){return $m || ($m = (function(_next){return _gt()(_n)((function(){var $m; return (function(){return $m || ($m = (_head()(_next)))})})())((function(){var $m; return (function(){return $m || ($m = (_$r()((function(){var $m; return (function(){return $m || ($m = (_$o()((function(){return 1}))((function(){var $m; return (function(){return $m || ($m = (_head()(_next)))})})())))})})())(_$s)))})})())((function(){var $m; return (function(){return $m || ($m = (_$r()(_n)(_$q)((function(){var $m; return (function(){return $m || ($m = (_pairF()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_next)))})})())))})})())(_$s)))})})());}((function(){var $m; return (function(){return $m || ($m = (__dropLast()(_pairF)(_n)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})());};};}));}})(), 3, "\\pairF. \\n. \\list. eq list nil\n  [0]\n  (\\next . gt n (head next)\n    [(+ 1 (head next))]\n    [n | (pairF (head list) (tail next))]) (_dropLast pairF n (tail list))");;
//series = AST(λfunc n . cons n (series func (func n)))
root.defs._series = _series = Parse.define('series', (function() {var f; return function _series(){return f || (f = (function(_func){return function(_n){return _cons()(_n)((function(){var $m; return (function(){return $m || ($m = (_series()(_func)((function(){var $m; return (function(){return $m || ($m = (_func()(_n)))})})())))})})());};}));}})(), 2, "\\func. \\n. cons n (series func (func n))");;
//from = AST(λn . series ++ n)
root.defs._from = _from = Parse.define('from', (function() {var f; return function _from(){return f || (f = (function(_n){return _series()(_$o$o)(_n);}));}})(), 1, "\\n. series ++ n");;
//fromBy = AST(λn inc . series (+ inc) n)
root.defs._fromBy = _fromBy = Parse.define('fromBy', (function() {var f; return function _fromBy(){return f || (f = (function(_n){return function(_inc){return _series()((function(){var $m; return (function(){return $m || ($m = (_$o()(_inc)))})})())(_n);};}));}})(), 2, "\\n. \\inc. series (+ inc) n");;
//fromTo = AST(λn m . takeWhile (> m) (from n))
root.defs._fromTo = _fromTo = Parse.define('fromTo', (function() {var f; return function _fromTo(){return f || (f = (function(_n){return function(_m){return _takeWhile()((function(){var $m; return (function(){return $m || ($m = (_$z()(_m)))})})())((function(){var $m; return (function(){return $m || ($m = (_from()(_n)))})})());};}));}})(), 2, "\\n. \\m. takeWhile (> m) (from n)");;
//fromToBy = AST(λn m inc . takeWhile (> m) (fromBy n inc))
root.defs._fromToBy = _fromToBy = Parse.define('fromToBy', (function() {var f; return function _fromToBy(){return f || (f = (function(_n){return function(_m){return function(_inc){return _takeWhile()((function(){var $m; return (function(){return $m || ($m = (_$z()(_m)))})})())((function(){var $m; return (function(){return $m || ($m = (_fromBy()(_n)(_inc)))})})());};};}));}})(), 3, "\\n. \\m. \\inc. takeWhile (> m) (fromBy n inc)");;
//any = AST(λf l . _any (pairFunc l) f l)
root.defs._any = _any = Parse.define('any', (function() {var f; return function _any(){return f || (f = (function(_f){return function(_l){return __any()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_l)))})})())(_f)(_l);};}));}})(), 2, "\\f. \\l. _any (pairFunc l) f l");;
//_any = AST(λpairF f l . null? l false (or (f (head l)) (_any pairF f (tail l))))
root.defs.__any = __any = Parse.define('_any', (function() {var f; return function __any(){return f || (f = (function(_pairF){return function(_f){return function(_l){return _null$e()(_l)(_false)((function(){var $m; return (function(){return $m || ($m = (_or()((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (__any()(_pairF)(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());};};}));}})(), 3, "\\pairF. \\f. \\l. null? l\n  false\n  or\n    f (head l)\n    _any pairF f (tail l)");;
//all = AST(λf l . _all (pairFunc l) f l)
root.defs._all = _all = Parse.define('all', (function() {var f; return function _all(){return f || (f = (function(_f){return function(_l){return __all()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_l)))})})())(_f)(_l);};}));}})(), 2, "\\f. \\l. _all (pairFunc l) f l");;
//_all = AST(λpairF f l . null? l true (and (f (head l)) (_all pairF f (tail l))))
root.defs.__all = __all = Parse.define('_all', (function() {var f; return function __all(){return f || (f = (function(_pairF){return function(_f){return function(_l){return _null$e()(_l)(_true)((function(){var $m; return (function(){return $m || ($m = (_and()((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (__all()(_pairF)(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());};};}));}})(), 3, "\\pairF. \\f. \\l. null? l\n  true\n  and\n    f (head l)\n    _all pairF f (tail l)");;
//index_combine = AST(λx y . or (eq x nil) (eq y nil) nil (+ x y))
root.defs._index_combine = _index_combine = Parse.define('index_combine', (function() {var f; return function _index_combine(){return f || (f = (function(_x){return function(_y){return _or()((function(){var $m; return (function(){return $m || ($m = (_eq()(_x)(_nil)))})})())((function(){var $m; return (function(){return $m || ($m = (_eq()(_y)(_nil)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_$o()(_x)(_y)))})})());};}));}})(), 2, "\\x. \\y. (or (eq x nil) (eq y nil)) (nil) (+ x y)");;
//indexof = AST(λl x . if (eq l nil) nil (if (eq x (head l)) 0 (index_combine 1 (indexof (tail l) x))))
root.defs._indexof = _indexof = Parse.define('indexof', (function() {var f; return function _indexof(){return f || (f = (function(_l){return function(_x){return _if()((function(){var $m; return (function(){return $m || ($m = (_eq()(_l)(_nil)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_if()((function(){var $m; return (function(){return $m || ($m = (_eq()(_x)((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())))})})())((function(){return 0}))((function(){var $m; return (function(){return $m || ($m = (_index_combine()((function(){return 1}))((function(){var $m; return (function(){return $m || ($m = (_indexof()((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())(_x)))})})())))})})())))})})());};}));}})(), 2, "\\l. \\x. if (eq l nil) (nil) (if (eq x (head l)) (0) (index_combine 1 (indexof (tail l) x ) ) )");;
//position = AST(λl x . indexof x l)
root.defs._position = _position = Parse.define('position', (function() {var f; return function _position(){return f || (f = (function(_l){return function(_x){return _indexof()(_x)(_l);};}));}})(), 2, "\\l. \\x. indexof x l");;
//find = AST(λx l . findIf (eq x) l)
root.defs._find = _find = Parse.define('find', (function() {var f; return function _find(){return f || (f = (function(_x){return function(_l){return _findIf()((function(){var $m; return (function(){return $m || ($m = (_eq()(_x)))})})())(_l);};}));}})(), 2, "\\x. \\l. findIf (eq x) l");;
//findIf = AST(λf l . null? l nil (f (head l) (head l) (findIf f (tail l))))
root.defs._findIf = _findIf = Parse.define('findIf', (function() {var f; return function _findIf(){return f || (f = (function(_f){return function(_l){return _null$e()(_l)(_nil)((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_findIf()(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());};}));}})(), 2, "\\f. \\l. null? l\n  nil\n  (f (head l)) (head l) (findIf f (tail l))");;
//findIfOpt = AST(λf l . null? l none (f (head l) (some (head l)) (findIfOpt f (tail l))))
root.defs._findIfOpt = _findIfOpt = Parse.define('findIfOpt', (function() {var f; return function _findIfOpt(){return f || (f = (function(_f){return function(_l){return _null$e()(_l)(_none)((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_some()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_findIfOpt()(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());};}));}})(), 2, "\\f. \\l. null? l\n  none\n  (f (head l)) (some (head l)) (findIfOpt f (tail l))");;
//count = AST(λx l . countIf (eq x) l)
root.defs._count = _count = Parse.define('count', (function() {var f; return function _count(){return f || (f = (function(_x){return function(_l){return _countIf()((function(){var $m; return (function(){return $m || ($m = (_eq()(_x)))})})())(_l);};}));}})(), 2, "\\x. \\l. countIf (eq x) l");;
//countIf = AST(λf l . if (eq l nil) 0 (+ (f (head l) 1 0) (countIf f (tail l))))
root.defs._countIf = _countIf = Parse.define('countIf', (function() {var f; return function _countIf(){return f || (f = (function(_f){return function(_l){return _if()((function(){var $m; return (function(){return $m || ($m = (_eq()(_l)(_nil)))})})())((function(){return 0}))((function(){var $m; return (function(){return $m || ($m = (_$o()((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){return 1}))((function(){return 0}))))})})())((function(){var $m; return (function(){return $m || ($m = (_countIf()(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})());};}));}})(), 2, "\\f. \\l. if (eq l nil) 0\n  + (f (head l) 1 0) (countIf f (tail l))");;
//countIfNot = AST(λf l . countIf λx . not (f x) l)
root.defs._countIfNot = _countIfNot = Parse.define('countIfNot', (function() {var f; return function _countIfNot(){return f || (f = (function(_f){return function(_l){return _countIf()((function(){var $m; return (function(){return $m || ($m = (function(_x){return _not()((function(){var $m; return (function(){return $m || ($m = (_f()(_x)))})})());}))})})())(_l);};}));}})(), 2, "\\f. \\l. countIf (\\x. not (f x)) l");;
//remove = AST(λx l . removeIf (eq x) l)
root.defs._remove = _remove = Parse.define('remove', (function() {var f; return function _remove(){return f || (f = (function(_x){return function(_l){return _removeIf()((function(){var $m; return (function(){return $m || ($m = (_eq()(_x)))})})())(_l);};}));}})(), 2, "\\x. \\l. removeIf (eq x) l");;
//removeIf = AST(λf l . _removeIf (pairFunc l) f l)
root.defs._removeIf = _removeIf = Parse.define('removeIf', (function() {var f; return function _removeIf(){return f || (f = (function(_f){return function(_l){return __removeIf()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_l)))})})())(_f)(_l);};}));}})(), 2, "\\f. \\l. _removeIf (pairFunc l) f l");;
//_removeIf = AST(λpairF f l . if (eq l nil) nil (if (f (head l)) (_removeIf pairF f (tail l)) (pairF (head l) (_removeIf pairF f (tail l)))))
root.defs.__removeIf = __removeIf = Parse.define('_removeIf', (function() {var f; return function __removeIf(){return f || (f = (function(_pairF){return function(_f){return function(_l){return _if()((function(){var $m; return (function(){return $m || ($m = (_eq()(_l)(_nil)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_if()((function(){var $m; return (function(){return $m || ($m = (_f()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (__removeIf()(_pairF)(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_pairF()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (__removeIf()(_pairF)(_f)((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})())))})})());};};}));}})(), 3, "\\pairF. \\f. \\l. if (eq l nil) nil\n  if (f (head l)) (_removeIf pairF f (tail l))\n    pairF (head l) (_removeIf pairF f (tail l))");;
//removeIfNot = AST(λf l . removeIf λx . not (f x) l)
root.defs._removeIfNot = _removeIfNot = Parse.define('removeIfNot', (function() {var f; return function _removeIfNot(){return f || (f = (function(_f){return function(_l){return _removeIf()((function(){var $m; return (function(){return $m || ($m = (function(_x){return _not()((function(){var $m; return (function(){return $m || ($m = (_f()(_x)))})})());}))})})())(_l);};}));}})(), 2, "\\f. \\l. removeIf (\\x. not (f x)) l");;
//filter = AST(λf . removeIf (compose not f))
root.defs._filter = _filter = Parse.define('filter', (function() {var f; return function _filter(){return f || (f = (function(_f){return _removeIf()((function(){var $m; return (function(){return $m || ($m = (_compose()(_not)(_f)))})})());}));}})(), 1, "\\f. removeIf (compose not f)");;
//map = AST(λfunc list . _map (pairFunc list) func list)
root.defs._map = _map = Parse.define('map', (function() {var f; return function _map(){return f || (f = (function(_func){return function(_list){return __map()((function(){var $m; return (function(){return $m || ($m = (_pairFunc()(_list)))})})())(_func)(_list);};}));}})(), 2, "\\func. \\list. _map (pairFunc list) func list");;
//_map = AST(λpairF func list . null? list nil (pairF (func (head list)) (_map pairF func (tail list))))
root.defs.__map = __map = Parse.define('_map', (function() {var f; return function __map(){return f || (f = (function(_pairF){return function(_func){return function(_list){return _null$e()(_list)(_nil)((function(){var $m; return (function(){return $m || ($m = (_pairF()((function(){var $m; return (function(){return $m || ($m = (_func()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (__map()(_pairF)(_func)((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})());};};}));}})(), 3, "\\pairF. \\func. \\list. null? list\n  nil\n  pairF (func (head list)) (_map pairF func (tail list))");;
//reduce = AST(λfunc list . foldl1 func list)
root.defs._reduce = _reduce = Parse.define('reduce', (function() {var f; return function _reduce(){return f || (f = (function(_func){return function(_list){return _foldl1()(_func)(_list);};}));}})(), 2, "\\func. \\list. foldl1 func list");;
//[ = AST(λitem . eq item ] nil (nextListItem (dl item)))
root.defs._$r = _$r = Parse.define('[', (function() {var f; return function _$r(){return f || (f = (function(_item){return _eq()(_item)(_$s)(_nil)((function(){var $m; return (function(){return $m || ($m = (_nextListItem()((function(){var $m; return (function(){return $m || ($m = (_dl()(_item)))})})())))})})());}));}})(), 1, "\\item. eq item `]`\n  nil\n  nextListItem (dl item)");;
//] = AST(λx . x)
root.defs._$s = _$s = Parse.define(']', (function() {var f; return function _$s(){return f || (f = (Parse.setType(function(_x){return _x();}, ']')));}})(), 0, "\\x . x");;
//| = AST(λx . x)
root.defs._$q = _$q = Parse.define('|', (function() {var f; return function _$q(){return f || (f = (Parse.setType(function(_x){return _x();}, '|')));}})(), 0, "\\x . x");;
//, = AST(λx . x)
root.defs._$b = _$b = Parse.define(',', (function() {var f; return function _$b(){return f || (f = (Parse.setType(function(_x){return _x();}, ',')));}})(), 0, "\\x . x");;
//nextListItem = AST(λitems next . eq next ] (items nil) (eq next | λtail close . items tail (eq next , (nextListItem items) (nextListItem (dlAppend items (dl next))))))
root.defs._nextListItem = _nextListItem = Parse.define('nextListItem', (function() {var f; return function _nextListItem(){return f || (f = (function(_items){return function(_next){return _eq()(_next)(_$s)((function(){var $m; return (function(){return $m || ($m = (_items()(_nil)))})})())((function(){var $m; return (function(){return $m || ($m = (_eq()(_next)(_$q)((function(){var $m; return (function(){return $m || ($m = (function(_tail){return function(_close){return _items()(_tail);};}))})})())((function(){var $m; return (function(){return $m || ($m = (_eq()(_next)(_$b)((function(){var $m; return (function(){return $m || ($m = (_nextListItem()(_items)))})})())((function(){var $m; return (function(){return $m || ($m = (_nextListItem()((function(){var $m; return (function(){return $m || ($m = (_dlAppend()(_items)((function(){var $m; return (function(){return $m || ($m = (_dl()(_next)))})})())))})})())))})})())))})})())))})})());};}));}})(), 2, "\\items. \\next. eq next `]`\n  items nil\n  eq next `|`\n    \\tail close . items tail\n    eq next `,`\n      nextListItem items\n      nextListItem (dlAppend items (dl next))");;
//dlempty = AST(id)
root.defs._dlempty = _dlempty = Parse.define('dlempty', (function _dlempty() {return ((_id()));}), 0, "id");;
//dl = AST(λitem rest . cons item rest)
root.defs._dl = _dl = Parse.define('dl', (function() {var f; return function _dl(){return f || (f = (Parse.setDataType(function(_item){return Parse.setType(function(_rest){return _cons()(_item)(_rest);}, 'dl');}, 'dl')));}})(), 1, "\\item. \\rest . cons item rest");;
//dlAppend = AST(λa b rest . a (b rest))
root.defs._dlAppend = _dlAppend = Parse.define('dlAppend', (function() {var f; return function _dlAppend(){return f || (f = (Parse.setDataType(function(_a){return function(_b){return Parse.setType(function(_rest){return _a()((function(){var $m; return (function(){return $m || ($m = (_b()(_rest)))})})());}, 'dlAppend');};}, 'dlAppend')));}})(), 2, "\\a. \\b. \\rest . a (b rest)");;
//identMacro = AST(λlist . tail list)
root.defs._identMacro = _identMacro = Parse.defineMacro('identMacro', (function() {var f; return function _identMacro(){return f || (f = (function(_list){return _tail()(_list);}));}})(), 1, "\\list. tail list");
root.tokenDefs.push('identMacro', '=M=');;
//macroCons = AST(λlist . cons "cons" (tail list))
root.defs._macroCons = _macroCons = Parse.defineMacro('macroCons', (function() {var f; return function _macroCons(){return f || (f = (function(_list){return _cons()((function(){return "cons"}))((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})());}));}})(), 1, "\\list. cons 'cons' (tail list)");
root.tokenDefs.push('macroCons', '=M=');;
//do = AST(λlist . foldr1 λel . doClause el (tail list))
root.defs._do = _do = Parse.defineMacro('do', (function() {var f; return function _do(){return f || (f = (function(_list){return _foldr1()((function(){var $m; return (function(){return $m || ($m = (function(_el){return _doClause()(_el);}))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})());}));}})(), 1, "\\list. foldr1 (\\el . doClause el) (tail list)");
root.tokenDefs.push('do', '=M=');;
//doClause = AST(λclause rest . doExtractVar clause "<-" λvar . [ "bind" (tail (tail clause)) "\\" var "." rest ] (doExtractVar clause "=" λvar . [ ([ "\\" var "." rest ]) (tail (tail clause)) ] ([ "bind" clause "\\" "_" "." rest ])))
root.defs._doClause = _doClause = Parse.define('doClause', (function() {var f; return function _doClause(){return f || (f = (function(_clause){return function(_rest){return _doExtractVar()(_clause)((function(){return "<-"}))((function(){var $m; return (function(){return $m || ($m = (function(_var){return _$r()((function(){return "bind"}))((function(){var $m; return (function(){return $m || ($m = (_tail()((function(){var $m; return (function(){return $m || ($m = (_tail()(_clause)))})})())))})})())((function(){return "\\"}))(_var)((function(){return "."}))(_rest)(_$s);}))})})())((function(){var $m; return (function(){return $m || ($m = (_doExtractVar()(_clause)((function(){return "="}))((function(){var $m; return (function(){return $m || ($m = (function(_var){return _$r()((function(){var $m; return (function(){return $m || ($m = (_$r()((function(){return "\\"}))(_var)((function(){return "."}))(_rest)(_$s)))})})())((function(){var $m; return (function(){return $m || ($m = (_tail()((function(){var $m; return (function(){return $m || ($m = (_tail()(_clause)))})})())))})})())(_$s);}))})})())((function(){var $m; return (function(){return $m || ($m = (_$r()((function(){return "bind"}))(_clause)((function(){return "\\"}))((function(){return "_"}))((function(){return "."}))(_rest)(_$s)))})})())))})})());};}));}})(), 2, "\\clause. \\rest. doExtractVar clause '<-'\n  \\var . ['bind' (tail (tail clause)) '\\\\' var '.' rest]\n  doExtractVar clause '='\n    \\var . [['\\\\' var '.' rest] (tail (tail clause))]\n    ['bind' clause '\\\\' '_' '.' rest]");;
//doExtractVar = AST(λlist tokName . and (is list lexCons) (and (is (tail list) lexCons) (and (is (head (tail list)) token) (eq tokName (tokenName (head (tail list)))))) (some (head list)) none)
root.defs._doExtractVar = _doExtractVar = Parse.define('doExtractVar', (function() {var f; return function _doExtractVar(){return f || (f = (function(_list){return function(_tokName){return _and()((function(){var $m; return (function(){return $m || ($m = (_is()(_list)(_lexCons)))})})())((function(){var $m; return (function(){return $m || ($m = (_and()((function(){var $m; return (function(){return $m || ($m = (_is()((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())(_lexCons)))})})())((function(){var $m; return (function(){return $m || ($m = (_and()((function(){var $m; return (function(){return $m || ($m = (_is()((function(){var $m; return (function(){return $m || ($m = (_head()((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())(_token)))})})())((function(){var $m; return (function(){return $m || ($m = (_eq()(_tokName)((function(){var $m; return (function(){return $m || ($m = (_tokenName()((function(){var $m; return (function(){return $m || ($m = (_head()((function(){var $m; return (function(){return $m || ($m = (_tail()(_list)))})})())))})})())))})})())))})})())))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_some()((function(){var $m; return (function(){return $m || ($m = (_head()(_list)))})})())))})})())(_none);};}));}})(), 2, "\\list. \\tokName. and\n  is list lexCons\n  and\n    is (tail list) lexCons\n    and\n      is (head (tail list)) token\n      eq tokName (tokenName (head (tail list)))\n  some (head list)\n  none");;
//html = AST(λx f . f x)
root.defs._html = _html = Parse.define('html', (function() {var f; return function _html(){return f || (f = (Parse.setDataType(function(_x){return Parse.setType(function(_f){return _f()(_x);}, 'html');}, 'html')));}})(), 1, "\\x. \\f . f x");;
//assocFromList = AST(λl . if (null? l) nil (assocSet (head l) (head (tail l)) (assocFromList (tail (tail l)))))
root.defs._assocFromList = _assocFromList = Parse.define('assocFromList', (function() {var f; return function _assocFromList(){return f || (f = (function(_l){return _if()((function(){var $m; return (function(){return $m || ($m = (_null$e()(_l)))})})())(_nil)((function(){var $m; return (function(){return $m || ($m = (_assocSet()((function(){var $m; return (function(){return $m || ($m = (_head()(_l)))})})())((function(){var $m; return (function(){return $m || ($m = (_head()((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_assocFromList()((function(){var $m; return (function(){return $m || ($m = (_tail()((function(){var $m; return (function(){return $m || ($m = (_tail()(_l)))})})())))})})())))})})())))})})());}));}})(), 1, "\\l. if (null? l) nil\n  assocSet (head l) (head (tail l)) (assocFromList (tail (tail l)))");;
//assocKey = AST(λcons . head cons)
root.defs._assocKey = _assocKey = Parse.define('assocKey', (function() {var f; return function _assocKey(){return f || (f = (function(_cons){return _head()(_cons);}));}})(), 1, "\\cons. head cons");;
//assocValue = AST(λcons . tail cons)
root.defs._assocValue = _assocValue = Parse.define('assocValue', (function() {var f; return function _assocValue(){return f || (f = (function(_cons){return _tail()(_cons);}));}})(), 1, "\\cons. tail cons");;
//assocGetPair = AST(λk anAssoc . findIf λx . eq (head x) k anAssoc)
root.defs._assocGetPair = _assocGetPair = Parse.define('assocGetPair', (function() {var f; return function _assocGetPair(){return f || (f = (function(_k){return function(_anAssoc){return _findIf()((function(){var $m; return (function(){return $m || ($m = (function(_x){return _eq()((function(){var $m; return (function(){return $m || ($m = (_head()(_x)))})})())(_k);}))})})())(_anAssoc);};}));}})(), 2, "\\k. \\anAssoc. findIf (\\x . eq (head x) k) anAssoc");;
//assocGetPairOpt = AST(λk l . l λh t D . h λkk vv . eq k kk (some2 kk vv) (assocGetPairOpt k t) none)
root.defs._assocGetPairOpt = _assocGetPairOpt = Parse.define('assocGetPairOpt', (function() {var f; return function _assocGetPairOpt(){return f || (f = (function(_k){return function(_l){return _l()((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_t){return function(_D){return _h()((function(){var $m; return (function(){return $m || ($m = (function(_kk){return function(_vv){return _eq()(_k)(_kk)((function(){var $m; return (function(){return $m || ($m = (_some2()(_kk)(_vv)))})})())((function(){var $m; return (function(){return $m || ($m = (_assocGetPairOpt()(_k)(_t)))})})());};}))})})());};};}))})})())(_none);};}));}})(), 2, "\\k. \\l. l (\\h t D . h (\\kk vv . (eq k kk) (some2 kk vv) (assocGetPairOpt k t))) none");;
//valueOrDefault = AST(λvalue default . if (neq value nil) value default)
root.defs._valueOrDefault = _valueOrDefault = Parse.define('valueOrDefault', (function() {var f; return function _valueOrDefault(){return f || (f = (function(_value){return function(_default){return _if()((function(){var $m; return (function(){return $m || ($m = (_neq()(_value)(_nil)))})})())(_value)(_default);};}));}})(), 2, "\\value. \\default. if (neq value nil) value default");;
//assocKeys = AST(λanAssoc . map λcell . assocKey cell anAssoc)
root.defs._assocKeys = _assocKeys = Parse.define('assocKeys', (function() {var f; return function _assocKeys(){return f || (f = (function(_anAssoc){return _map()((function(){var $m; return (function(){return $m || ($m = (function(_cell){return _assocKey()(_cell);}))})})())(_anAssoc);}));}})(), 1, "\\anAssoc. map (\\cell . (assocKey cell)) anAssoc");;
//assocNumKeys = AST(λanAssoc . length (assocKeys anAssoc))
root.defs._assocNumKeys = _assocNumKeys = Parse.define('assocNumKeys', (function() {var f; return function _assocNumKeys(){return f || (f = (function(_anAssoc){return _length()((function(){var $m; return (function(){return $m || ($m = (_assocKeys()(_anAssoc)))})})());}));}})(), 1, "\\anAssoc. length (assocKeys anAssoc)");;
//assocMergeKeys = AST(λhm1 hm2 keys . if (null? keys) hm1 (if (null? (assocGetPair (head keys) hm1)) (cons (assocGetPair (head keys) hm2) (assocMergeKeys hm1 hm2 (tail keys))) (assocMergeKeys hm1 hm2 (tail keys))))
root.defs._assocMergeKeys = _assocMergeKeys = Parse.define('assocMergeKeys', (function() {var f; return function _assocMergeKeys(){return f || (f = (function(_hm1){return function(_hm2){return function(_keys){return _if()((function(){var $m; return (function(){return $m || ($m = (_null$e()(_keys)))})})())(_hm1)((function(){var $m; return (function(){return $m || ($m = (_if()((function(){var $m; return (function(){return $m || ($m = (_null$e()((function(){var $m; return (function(){return $m || ($m = (_assocGetPair()((function(){var $m; return (function(){return $m || ($m = (_head()(_keys)))})})())(_hm1)))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_cons()((function(){var $m; return (function(){return $m || ($m = (_assocGetPair()((function(){var $m; return (function(){return $m || ($m = (_head()(_keys)))})})())(_hm2)))})})())((function(){var $m; return (function(){return $m || ($m = (_assocMergeKeys()(_hm1)(_hm2)((function(){var $m; return (function(){return $m || ($m = (_tail()(_keys)))})})())))})})())))})})())((function(){var $m; return (function(){return $m || ($m = (_assocMergeKeys()(_hm1)(_hm2)((function(){var $m; return (function(){return $m || ($m = (_tail()(_keys)))})})())))})})())))})})());};};}));}})(), 3, "\\hm1. \\hm2. \\keys. if (null? keys) hm1\n  if (null? (assocGetPair (head keys) hm1) )\n    cons (assocGetPair (head keys) hm2) (assocMergeKeys hm1 hm2 (tail keys))\n    assocMergeKeys hm1 hm2 (tail keys)");;
//assocMerge = AST(λhm1 hm2 . assocMergeKeys hm1 hm2 (assocKeys hm2))
root.defs._assocMerge = _assocMerge = Parse.define('assocMerge', (function() {var f; return function _assocMerge(){return f || (f = (function(_hm1){return function(_hm2){return _assocMergeKeys()(_hm1)(_hm2)((function(){var $m; return (function(){return $m || ($m = (_assocKeys()(_hm2)))})})());};}));}})(), 2, "\\hm1. \\hm2. assocMergeKeys hm1 hm2 (assocKeys hm2)");;
//assocSet = AST(λk v anAssoc . cons (cons k v) (assocRemove k anAssoc))
root.defs._assocSet = _assocSet = Parse.define('assocSet', (function() {var f; return function _assocSet(){return f || (f = (function(_k){return function(_v){return function(_anAssoc){return _cons()((function(){var $m; return (function(){return $m || ($m = (_cons()(_k)(_v)))})})())((function(){var $m; return (function(){return $m || ($m = (_assocRemove()(_k)(_anAssoc)))})})());};};}));}})(), 3, "\\k. \\v. \\anAssoc. cons (cons k v) (assocRemove k anAssoc)");;
//assocGet = AST(λk anAssoc . assocGetPair k anAssoc λh t D . some h none)
root.defs._assocGet = _assocGet = Parse.define('assocGet', (function() {var f; return function _assocGet(){return f || (f = (function(_k){return function(_anAssoc){return _assocGetPair()(_k)(_anAssoc)((function(){var $m; return (function(){return $m || ($m = (function(_h){return function(_t){return function(_D){return _some()(_h);};};}))})})())(_none);};}));}})(), 2, "\\k. \\anAssoc. (assocGetPair k anAssoc) (\\h t D . some h) none");;
//assocGetWithDefault = AST(λk default anAssoc . valueOrDefault (assocGet k anAssoc) default)
root.defs._assocGetWithDefault = _assocGetWithDefault = Parse.define('assocGetWithDefault', (function() {var f; return function _assocGetWithDefault(){return f || (f = (function(_k){return function(_default){return function(_anAssoc){return _valueOrDefault()((function(){var $m; return (function(){return $m || ($m = (_assocGet()(_k)(_anAssoc)))})})())(_default);};};}));}})(), 3, "\\k. \\default. \\anAssoc. valueOrDefault (assocGet k anAssoc) default");;
//assocRemove = AST(λk anAssoc . removeIf λx . eq (assocKey x) k anAssoc)
root.defs._assocRemove = _assocRemove = Parse.define('assocRemove', (function() {var f; return function _assocRemove(){return f || (f = (function(_k){return function(_anAssoc){return _removeIf()((function(){var $m; return (function(){return $m || ($m = (function(_x){return _eq()((function(){var $m; return (function(){return $m || ($m = (_assocKey()(_x)))})})())(_k);}))})})())(_anAssoc);};}));}})(), 2, "\\k. \\anAssoc. removeIf (\\x . eq (assocKey x) k) anAssoc");;

//if (typeof window !== 'undefined' && window !== null) {
//  Leisure.processTokenDefs(root.tokenDefs);
//}
return root;
}).call(this)