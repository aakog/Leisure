Project-wide requirejs configuration for Leisure

    requirejs.config
      #baseUrl: (new URL(requirejs.leisureCompiled ? 'build' : 'src', document.location)).pathname.replace(/\/.*:/, ''),
      #baseUrl: requirejs.leisureCompiled ? 'build' : 'src',
      # disable coffeescript if this is true
      # this will load *.js files instead of *.coffee or *.litcoffee
      disableCoffeeScript: requirejs.leisureCompiled
      paths:
        # the left side is the module ID,
        # the right side is the path to
        # the jQuery file, relative to baseUrl.
        # Also, the path should NOT include
        # the '.js' file extension. This example
        # is using jQuery 1.9.0 located at
        # js/lib/jquery-1.9.0.js, relative to
        # the HTML page.

        jquery: 'lib/jquery-2.1.4'
        jqueryui:    'lib/jquery-ui.min-1.11.4'
        #jqueryui:   'lib/jquery-ui-1.11.4'
        acorn:       'lib/acorn-3.2.0'
        acorn_loose: 'lib/acorn_loose-3.2.0'
        acorn_walk:  'lib/acorn_walk-3.2.0'
        immutable:   'lib/immutable-3.8.1.min'
        handlebars:  'lib/handlebars-v4.0.5'
        sockjs:      'lib/sockjs-1.0.0.min'
        lispyscript: 'lib/lispyscript/browser-bundle'
        lodash:      'lib/lodash.full-4.14.1'
        bluebird:    'lib/bluebird-3.5.0'
        fingertree:  'lib/fingertree'
        "browser-source-map-support": 'lib/browser-source-map-support-0.4.14'

    #define 'TEST', [], "HELLO"
    #require ['./editor'], (editor)->
    #  console.log "REDEFINING JQUERY:", editor
    #  define 'jquery', [], editor.$$$
