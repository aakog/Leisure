// Generated by CoffeeScript 1.10.0
(function() {
  var init;

  require(['./domCursor'], function(DC) {
    return window.DOMCursor = DC;
  });

  init = function(jqui, EditorSupport, Modes, Diag, P2P, Tests, Webrtc, Defaults, UI, BrowserExports, Search, Emacs, Todo, Advice, GDrive) {
    var DEFAULT_PAGE, OrgData, Peer, addEmacsDataFilter, addSearchDataFilter, changeAdvice, checkImage, configureLocal, createEditorDisplay, createStructureDisplay, editorToolbar, fancyEditDiv, findPeer, getDocumentParams, initializePendingViews, installSelectionMenu, localResources, mergeExports, p2pConnections, p2pPanel, peer, plainEditDiv, renderView, runTests, setPanelExpanded, todoForEditor, useP2P, withContext;
    OrgData = EditorSupport.OrgData, installSelectionMenu = EditorSupport.installSelectionMenu, getDocumentParams = EditorSupport.getDocumentParams, editorToolbar = EditorSupport.editorToolbar;
    plainEditDiv = Modes.plainEditDiv, fancyEditDiv = Modes.fancyEditDiv;
    createStructureDisplay = Diag.createStructureDisplay, createEditorDisplay = Diag.createEditorDisplay;
    Peer = P2P.Peer;
    findPeer = Webrtc.findPeer;
    runTests = Tests.runTests;
    renderView = UI.renderView, initializePendingViews = UI.initializePendingViews, withContext = UI.withContext, setPanelExpanded = UI.setPanelExpanded, localResources = UI.localResources;
    mergeExports = BrowserExports.mergeExports;
    addSearchDataFilter = Search.addSearchDataFilter;
    addEmacsDataFilter = Emacs.addEmacsDataFilter;
    todoForEditor = Todo.todoForEditor;
    changeAdvice = Advice.changeAdvice;
    useP2P = true;
    peer = null;
    p2pPanel = null;
    p2pConnections = null;
    DEFAULT_PAGE = 'demo/documentComputers.lorg';
    Leisure.configureP2P = function(arg) {
      var connections, createSessionButton, hostField, panel, sessionField;
      panel = arg.panel, hostField = arg.hostField, sessionField = arg.sessionField, createSessionButton = arg.createSessionButton, connections = arg.connections;
      p2pPanel = panel;
      p2pConnections = connections;
      if (!useP2P) {
        panel.css('display', 'none');
      }
      hostField.val(document.location.host || "localhost:8080");
      createSessionButton.data({
        hasSession: false
      });
      Leisure.createSession = function(url, doneFunc) {
        createSessionButton.closest('.contents').removeClass('not-connected');
        createSessionButton.closest('.contents').addClass('connected');
        return peer.createSession(hostField.val(), (function(con) {
          url = new URL("", document.location);
          url.search = "?join=" + peer.connectUrl;
          sessionField.attr('href', url.toString());
          sessionField.text(url.toString());
          setPanelExpanded(panel, true);
          createSessionButton.button('option', 'label', 'Disconnect');
          return typeof doneFunc === "function" ? doneFunc() : void 0;
        }), function(n) {
          return connections.html(n);
        });
      };
      return createSessionButton.click(function() {
        if (!createSessionButton.data().hasSession) {
          Leisure.createSession(hostField.val());
        } else {
          createSessionButton.closest('.contents').removeClass('connected');
          createSessionButton.closest('.contents').addClass('not-connected');
          peer.disconnect();
          createSessionButton.button('option', 'label', 'Create Session');
          setTimeout((function() {
            return setPanelExpanded(panel, true);
          }), 1);
        }
        return createSessionButton.data({
          hasSession: !createSessionButton.data().hasSession
        });
      });
    };
    configureLocal = function(opts) {
      var u;
      u = new URL('.', opts.loadName);
      opts.data.localURL = u.href;
      return changeAdvice(opts.editor, true, {
        activateScripts: {
          local: function(parent) {
            return function(el, context) {
              var errorEvt, i, img, len, ref, results, ret;
              ret = parent(el, context);
              errorEvt = function(e) {
                checkImage(opts, e.target);
                return e.target.removeEventListener('load', errorEvt);
              };
              ref = $(el).find('img');
              results = [];
              for (i = 0, len = ref.length; i < len; i++) {
                img = ref[i];
                if (!img.complete && !localResources[img.src]) {
                  img.addEventListener('error', errorEvt);
                  results.push(img.addEventListener('load', function(e) {
                    return e.target.removeEventListener(errorEvt);
                  }));
                } else {
                  results.push(checkImage(opts, img));
                }
              }
              return results;
            };
          }
        }
      });
    };
    checkImage = function(opts, img) {
      var name, ref, ref1, src, u;
      if ((img.complete && !img.naturalHeight) || localResources[img.src]) {
        src = img.getAttribute('src');
        if (!src.match('^.*:.*')) {
          name = (ref = src.match(/([^#?]*)([#?].*)?$/)) != null ? ref[1] : void 0;
        } else {
          name = (ref1 = src.match(/^file:([^#?]*)([#?].*)?$/)) != null ? ref1[1] : void 0;
        }
        if (name && !img.leisureLoaded) {
          img.leisureLoaded = true;
          u = new URL(name, opts.loadName);
          return localResources[img.src] = img.src = u.href;
        }
      }
    };
    return $(document).ready(function() {
      var data, join, load, ref, theme;
      runTests();
      installSelectionMenu();
      if (useP2P) {
        window.PEER = peer = new Peer;
        window.DATA = data = peer.data;
        if (p2pPanel != null) {
          p2pPanel.css('display', '');
        }
      } else {
        window.DATA = data = new OrgData();
      }
      addSearchDataFilter(data);
      data.processDefaults(Defaults);
      createStructureDisplay(data);
      window.ED = fancyEditDiv($("[maindoc]"), data);
      if (useP2P) {
        window.PEER.setEditor(ED);
      }
      createEditorDisplay(ED);
      todoForEditor(ED);
      if (document.location.search) {
        ref = getDocumentParams(), load = ref.load, theme = ref.theme, join = ref.join;
      } else {
        load = DEFAULT_PAGE;
      }
      if (load) {
        load = new URL(load, document.location).toString();
        ED.options.loadName = load;
        configureLocal(ED.options);
        $.get(load, function(data) {
          return ED.options.load(load, data);
        });
      }
      if (theme) {
        ED.options.setTheme(theme);
      }
      if (join) {
        setTimeout((function() {
          var createSessionButton, u;
          createSessionButton = $(editorToolbar(window.PEER.editor.node)).find('[name=p2pConnector] [name=createSession]');
          createSessionButton.data({
            hasSession: true
          });
          createSessionButton.closest('.contents').removeClass('not-connected');
          createSessionButton.closest('.contents').addClass('connected');
          createSessionButton.button('option', 'label', 'Disconnect');
          console.log("CREATE SESSION:", createSessionButton[0]);
          u = new URL(join);
          console.log("JOIN SESSION: " + u);
          return window.PEER.connectToSession(u.toString(), null, function(n) {
            return p2pConnections.html(n);
          });
        }), 1);
      }
      return $('#globalLoad').remove();
    });
  };

  require(['jquery'], function() {
    return require(['jqueryui', './editorSupport', './modes', './diag', './leisure-client-adapter', './tests', './lib/webrtc', 'text!../src/defaults.lorg', './ui', './export', './search', './emacs', './todo', './advice'], init);
  });

}).call(this);

//# sourceMappingURL=local.js.map
