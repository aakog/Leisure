###
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
###

###
Tests for Leisure
###

U = require('util')
{
  define,
  scan,
  cons,
  Nil,
  json2Ast,
  getLitVal,
  getRefVar,
  getLambdaBody
} = LZ = require './ast'
{run, assertParse, assertEval, assertEvalPrint, assertEq} = T = require './testing'
{gen} = require './newgen'

consFrom = (array, i)->
  i = i || 0
  if i < array.length then cons array[i], consFrom(array, i + 1) else Nil

console.log 'Testing'

debug = false

parseJson = (str)-> json2Ast JSON.parse str

define 'log', (-> (msg)->(val)->
  console.log msg()
  val())

ltrueAst = json2Ast
  _type: "lambda"
  varName: "a"
  body:
    _type: "lambda"
    varName: "b"
    body:
      _type: "ref"
      value: "a"

lfalseAst = json2Ast
  _type: "lambda"
  varName: "a"
  body:
    _type: "lambda"
    varName: "b"
    body:
      _type: "ref"
      value: "b"

lidAst = json2Ast
  _type: "lambda"
  varName: "x"
  body:
    _type: "ref"
    value: "x"

lapplyXY = json2Ast
  _type: "lambda"
  varName: "x"
  body:
    _type: "lambda"
    varName: "y"
    body:
      _type: "apply"
      func:
        _type: "ref"
        value: "x"
      arg:
        _type: "ref"
        value: "y"

let3Ast = json2Ast
  _type: 'let'
  varName: 'x'
  value:
    _type: 'lit'
    value: 3
  body:
    _type: 'let'
    varName: 'y'
    value:
      _type: 'apply'
      func:
        _type: 'apply'
        func:
          _type: 'ref'
          value: 'log'
        arg:
          _type: 'lit'
          value: "hello y"
      arg:
        _type: 'lit'
        value: 4
    body:
      _type: 'ref'
      value: 'x'

run 'test1', -> assertEq "1", "1"
run 'test2', -> assertEq "#{LZ.Nil}", "Cons[]"
run 'test3', -> assertEq "#{cons 1, cons(2, Nil)}", "Cons[1 2]"
run 'test4', -> assertEq "", ""
run 'test5', -> assertEq "#{consFrom ('1 2 3').split(' ')}", "Cons[1 2 3]"
run 'test6', -> assertEq "#{consFrom(('1 2 3').split(' ')).reverse()}", "Cons[3 2 1]"
run 'test7', -> assertEq "#{cons 1, 2}", "Cons[1 | 2]"
run 'test8', ->
  st = json2Ast
    _type: "lit"
    value: 3
  assertEq getLitVal(st), 3
run 'test9', ->
  st = json2Ast
    _type: "ref"
    value: 3
  assertEq getRefVar(st), 3
run 'test10', -> assertEq getRefVar(getLambdaBody(lidAst)), 'x'
run 'test11', ->
  st = json2Ast
    _type: "cons"
    head: 1
    tail:
      _type: "nil"
  assertEq "#{st}", "Cons[1]"
run 'test12', -> assertEq (gen lidAst), 'function(_x){return _x()}'
run 'test13', -> assertEq (gen lapplyXY), 'function(_x){return function(_y){return _x()(_y)}}'
run 'test14', -> assertEq (gen ltrueAst), 'function(_a){return function(_b){return _a()}}'
run 'test15', -> assertEq (eval "(#{gen ltrueAst})")(->5)(->6), 5
run 'test16', -> assertEq (eval "(#{gen lfalseAst})")(->5)(->6), 6
run 'test17', -> assertEq (eval "(#{gen let3Ast})"), 3

console.log '\nDone'
if !T.stats.failures then console.log "Succeeded all #{T.stats.successes} tests."
else
  console.log """
Succeeded #{T.stats.successes} test#{if T.stats.successes > 1 then 's' else ''}
Failed #{T.stats.failures} test#{if T.stats.failures > 1 then 's' else ''}:
"""
console.log "  #{f}" for f in T.stats.failed
process.exit(0)
