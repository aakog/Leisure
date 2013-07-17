Notes on New Leisure Core

# Contents

* MOTIVATION
* THE REPL
* THE LET AST STRUCTURE
* THE ANNO AST STRUCTURE
* FUTURE STUFF
   * PATTERN MATCHING
   * NAME SPACES
   * TYPE INFERENCE
   * REMOTE NOTEBOOK


# MOTIVATION

The fundamental motivation of the new core is to reduce the amount of low-level code and simplify it, so it's easier to provide alternate backends and make improvements at the lowest level.  The new core doesn't parse Leisure, it operates directly on ASTs and JSON-encoded ASTs.  This allows Leisure itself to implement the parsing.  Leisure can send ASTs directly to the core or generate low-level, JSON-encoded *.last files which the core can understand.

# RUNNING STUFF

To run the tests, use `make`.  To run the repl, use `make repl`.

# THE LET AST STRUCTURE

Let values can refer to all of the names defined by the let structure.  This allows for mutual recursion without polluting the name space.  It also allows do/let to do what programmers might expect when they define terms that reference each other.

# THE ANNO AST STRUCTURE

Lets programmers associate runtime-accessible key-value pairs with code.  The system will use standard keys for things like definitions and patterns, which are kind of outside the scope of Lambda Calculus, anyway.

# FUTURE STUFF

## PATTERN MATCHING

```
length list = match list
  [] -> 0
  [a | b] -> 1 + length b
  false

translates to

length list =
  eq (getType list) 'nil'
    0
    eq (getType list) 'cons'
      list (\a b . 1 + length b) false
      false
```

Dispatchers for simple pattern matching

For lets that dispatch on types, we can use "dispatchers" which use double dispatching to resolve inheritance in constant time.  Here's an example:

```
getLabel x = do
  label x::person = 'person'
  label x::animal = 'animal'
  label x::thing = 'other'
  label x
```

Using this hierarchy: thing(animal(cat,dog),person,vehicle(car)), a dispatcher could work roughly like this (dispatcher's are generated on demand at compile time)

```
getLabel = (function() {
  // create reusable dispatcher here
  var disp = newDispatcher({
    Leisure_person: function() {return function(x){return 'person'}},
    Leisure_animal: function() {return function(x){return 'animal'}},
    Leisure_thing: function() {function(x){return 'thing'}},
  })
  // definition that uses the dispatcher
  function(x){return disp.dispatch(x)(x)}
})()
```

When new types are added, it can invalidate the dispatch cache by incrementing a dispatchCacheCount variable.  The dispatch function can check this to see if it needs to recompute the dispatch methods.  The computed dispatcher would be something like this:

```
{
  Leisure_cat: function() {return this.Leisure_animal()},
  Leisure_dog: function() {return this.Leisure_animal()},
  Leisure_vehicle: function() {return this.Leisure_thing()},
  Leisure_car: function() {return this.Leisure_thing()}
}
```

Multiple dispatch could create a dispatchers that return other dispatchers.

### Notebook Function Signature Summaries

Since you can add cases in different files, it would be nice to be able to see all of the cases in one place.  Maybe a popup button or a box to the side?

## NAME SPACES

Gotta have 'em.

## TYPE INFERENCE

Counting arguments would be really helpful.  This case in the parser was hard to debug:

```
token txt pos = \f . f txt pos
withToken tok nonTokCase tokCase = isToken tok (tok tokCase) nonTokCase

withToken name err \n . ...
```

The function sent into withToken(), for tokCase only took one argument, but it was sent into tok() as f.  Tok then sent txt into tokCase and sent pos into the result of tokCase.

Maybe marking arguments which will be partially applied would be good?

Treat the number of args before a '.' or '=' as the "standard" number of arguments for a function and propagate these numbers around, by finding how a function is called in the code.

Lists might be an interesting case:

```
append a b = a (\h t D . cons h (append t b)) b  <--- This goes into the result
                       ^
                       |
                       +--- this function is only partly applied by a (it returns \D . ...)
```

## REMOTE NOTEBOOK

The notebook should be able to hook up to a remote Leisure instance, like SLIME does.  The remote instance can use Xus and JSON.