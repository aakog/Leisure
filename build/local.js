// Generated by CoffeeScript 1.9.3
(function() {
  var init;

  init = function(jqui, EditorSupport, Modes, Diag, P2P, Tests, Webrtc, Defaults, UI, BrowserExports, Search, Emacs) {
    var OrgData, Peer, addEmacsDataFilter, addSearchDataFilter, createEditorDisplay, createStructureDisplay, editorToolbar, fancyEditDiv, findPeer, getDocumentParams, initializePendingViews, installSelectionMenu, mergeExports, p2pConnections, p2pPanel, peer, plainEditDiv, renderView, runTests, setPanelExpanded, useP2P, withContext;
    OrgData = EditorSupport.OrgData, installSelectionMenu = EditorSupport.installSelectionMenu, getDocumentParams = EditorSupport.getDocumentParams, editorToolbar = EditorSupport.editorToolbar;
    plainEditDiv = Modes.plainEditDiv, fancyEditDiv = Modes.fancyEditDiv;
    createStructureDisplay = Diag.createStructureDisplay, createEditorDisplay = Diag.createEditorDisplay;
    Peer = P2P.Peer;
    findPeer = Webrtc.findPeer;
    runTests = Tests.runTests;
    renderView = UI.renderView, initializePendingViews = UI.initializePendingViews, withContext = UI.withContext, setPanelExpanded = UI.setPanelExpanded;
    mergeExports = BrowserExports.mergeExports;
    addSearchDataFilter = Search.addSearchDataFilter;
    addEmacsDataFilter = Emacs.addEmacsDataFilter;
    useP2P = true;
    peer = null;
    p2pPanel = null;
    p2pConnections = null;
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
      if (document.location.search) {
        ref = getDocumentParams(), load = ref.load, theme = ref.theme, join = ref.join;
        if (load) {
          $.get(load, function(data) {
            return ED.options.load(data);
          });
          ED.options.loadName = new URL(load, document.location).toString();
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
      } else {
        ED.options.load("Create a bad replacement with collaboration: asdf<-<-<-as\n\nburp\n* top\nbubba\n\n[[leisure:bubba]][[leisure:bubba]]\n\n#+NAME: bubba\n#+BEGIN_SRC yaml\ntype: rotator\ndegrees: 45\n#+END_SRC\n\n#+BEGIN_SRC leisure :results dynamic\n3 + 4\n#+END_SRC\n#+RESULTS:\n: 7\n\n#+BEGIN_SRC js :results dynamic\n3-4\n#+END_SRC\n#+RESULTS:\n: 7\n#+BEGIN_SRC lisp :results dynamic\n(+ 3 4)\n#+END_SRC\n#+BEGIN_SRC cs :results dynamic\n'<b>duh</b>'\nhtml '<b>duh</b>'\n37/3333\nhtml '<img src=\"https://imgs.xkcd.com/comics/lisp_cycles.png\">'\n#+END_SRC\n#+RESULTS:\n: &lt;b&gt;duh&lt;/b&gt;\n: <b>duh</b>\n: 0.0111011101110111\n: <img src=\"https://imgs.xkcd.com/comics/lisp_cycles.png\">\n\n#+BEGIN_HTML\n<b>hello</b>\n#+END_HTML\n\n#+BEGIN_SRC html :defview rotator\n<div style='padding: 25px; display: inline-block'>\n  <div style='transform: rotate({{degrees}}deg);height: 100px;width: 100px;background: green'></div>\n</div>\n#+END_SRC\n\n#+BEGIN_SRC cs :control rotator\n@initializeView = (view)-> #console.log \"initialize\", view\n#+END_SRC\n\n#+BEGIN_SRC html :defview leisure-headlineX\n<span id='{{id}}' data-block='headline'><span class='hidden'>{{stars}}</span><span class='maintext'>{{maintext}}</span>{{EOL}}{{nop\n}}</span>{{#each children}}{{{render this}}}{{/each}}</span>\n#+END_SRC\n\n#+BEGIN_SRC css\n[data-block='headline'] .maintext {\n  font-weight: bold;\n  color: blue;\n}\n.custom-headline {\n  font-weight: bold;\n  color: green;\n}\n[data-block='headline'] {\n  color: orangeX;\n}\n#+END_SRC\n* Test properties > splunge\n ** sub 1\n*/duh/*\n:properties:\n:hidden: true\n:a: 1\n:end:\n\n\nimage link\n[[https://imgs.xkcd.com/comics/lisp_cycles.png]]\n\npeep\n:properties:\n:b: 2\n:end:\n** sub 2\nasdf" + '\n');
      }
      return $('#globalLoad').remove();
    });
  };

  require(['jquery'], function() {
    return require(['jqueryui', './editorSupport', './modes', './diag', './leisure-client-adapter', './tests', './lib/webrtc', 'text!../src/defaults.lorg', './ui', './export', './search', './emacs', './hamtData'], init);
  });

}).call(this);

//# sourceMappingURL=local.js.map
