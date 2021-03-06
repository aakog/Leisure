    'use strict'
    define ['immutable', './editor', './editorSupport'], (immutable, Editor, Support)->
      {
        Map
      } = window.Immutable = immutable
      {
        DataStore
        preserveSelection
      } = Editor
      {
        OrgData
      } = Support

`HamtOrgData` uses a HAMT for blocks instead of a regular JS object,
to make it easier to handle merges.

      class HamtOrgData extends OrgData
        constructor: ->
          super()
          @blocks = new Map()
          @namedBlocks = new Map()
        snapshot: ->
          data = new HamtOrgData()
          data.installSnapshot this
          data
        installSnapshot: (data)->
          @blocks = data.blocks
          @blockIndex = data.blockIndex
          @namedBlocks = data.namedBlocks
        getFirst: -> getFirst @blocks
        setFirst: (firstId)-> @blocks = setFirst @blocks, firstId
        getBlock: (id, changes)->
          if typeof id != 'string' then id else changes?.sets[id] ? @blocks.get id
        setBlock: (id, block)->
          @makeChanges =>
            @runFilters @getBlock(id), block
            @blocks = @blocks.set id, block
            @indexBlock block
        deleteBlock: (id)->
          @makeChanges =>
            @runFilters @getBlock(id), null
            @blocks = @blocks.delete id
            @unindexBlock id
        getNamedBlockId: (name)-> @namedBlocks.get name
        setBlockName: (name, blockId)-> @namedBlocks = @namedBlocks.set name, blockId
        deleteBlockName: (name)-> @namedBlocks = @namedBlocks.delete name
        load: (first, newBlocks)->
          @makeChanges =>
            super first, setFirst((new Map newBlocks), first),
              sets: newBlocks
              oldBlocks: {}
              first: first
        makeChange: (change)->
          ch = super change
          ch.origin = change.origin
          ch

      getFirst = (blocks)-> blocks.get 'FIRST'
      setFirst = (blocks, firstId)-> blocks.set 'FIRST', firstId

      {
        HamtOrgData
      }
