Lorg file registry

    require?('./preamble')
    root = Leisure

    registry = {}

    registerFile = (name)->
      if !registry[name] then registry[name] =
        exports: {}
        controls: {}
        views: {}
        css: []
        html: []
      registry[name]

    root.registerFile = registerFile
