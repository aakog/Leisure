// Generated by CoffeeScript 1.9.3
(function() {
  var slice = [].slice;

  define(['./lib/lodash.min', 'cs!./export.litcoffee', 'cs!./ui.litcoffee', 'cs!./editor.litcoffee', 'cs!./editorSupport.litcoffee', 'cs!./diag.litcoffee'], function(_, Exports, UI, Editor, EditorSupport, Diag) {
    var advise, aroundMethod, blockRangeFor, c, clearDiag, close, configureEmacs, connect, connected, diag, diagMessage, e, error, escapeAttr, escapeString, escaped, fileCount, fileTypes, findEditor, getDocumentParams, imgCount, mergeExports, message, messages, msgPat, offsetFor, open, preserveSelection, pushPendingInitialzation, receiveFile, renderImage, replace, replaceMsgPat, replaceWhile, replacing, sendCcCc, sendFollowLink, sendGetFile, sendReplace, showDiag, showMessage, slashed, specials, typeForFile, unescapeString, unescaped;
    mergeExports = Exports.mergeExports;
    findEditor = Editor.findEditor, preserveSelection = Editor.preserveSelection, aroundMethod = Editor.aroundMethod, advise = Editor.advise;
    showMessage = UI.showMessage, pushPendingInitialzation = UI.pushPendingInitialzation, escapeAttr = UI.escapeAttr;
    getDocumentParams = EditorSupport.getDocumentParams;
    clearDiag = Diag.clearDiag, diagMessage = Diag.diagMessage;
    msgPat = /^([^ ]+)( (.*))?$/;
    replaceMsgPat = /^([^ ]+) ([^ ]+) ([^ ]+) (.*)$/;
    replacing = false;
    connected = false;
    showDiag = false;
    imgCount = 0;
    fileCount = 0;
    fileTypes = {
      pgn: 'image/png',
      gif: 'image/gif',
      bmp: 'image/bmp',
      xpm: 'image/xpm',
      svg: 'image/svg'
    };
    diag = function() {
      var msg;
      msg = 1 <= arguments.length ? slice.call(arguments, 0) : [];
      if (showDiag) {
        return console.log.apply(console, msg);
      }
    };
    messages = {
      r: function(data, msg, frame) {
        return replace(data, msg);
      },
      reload: function() {
        return document.location.href = document.location.href;
      },
      activate: function() {
        window.open("javascript:close()");
        return window.focus();
      },
      file: function(data, msg, frame) {
        return receiveFile(data, msg);
      }
    };
    replace = function(data, msg) {
      var count, editor, end, ignore, ref, start, text;
      diag("Received " + msg);
      ref = msg.match(replaceMsgPat), ignore = ref[0], count = ref[1], start = ref[2], end = ref[3], text = ref[4];
      start = Number(start);
      end = Number(end);
      text = JSON.parse(text);
      editor = data.emacsConnection.opts.editor;
      return replaceWhile(function() {
        var endLen, targetLen;
        if (end === -1) {
          return editor.options.load(text);
        } else {
          targetLen = data.getDocLength() - (end - start) + text.length;
          editor.replace(null, blockRangeFor(data, start, end), text);
          endLen = data.getDocLength();
          if (endLen !== targetLen) {
            return diagMessage("BAD DOC LENGTH AFTER REPLACEMENT, expected <" + targetLen + "> but ggot<" + endLen + ">");
          }
        }
      });
    };
    receiveFile = function(data, msg) {
      var base, id, lead, ref;
      ref = msg.match(/^([^ ]+) +/), lead = ref[0], id = ref[1];
      if (typeof (base = data.emacsConnection.fileCallbacks)[id] === "function") {
        base[id](msg.substring(lead.length));
      }
      return delete data.emacsConnection.fileCallbacks[id];
    };
    replaceWhile = function(func) {
      replacing = true;
      try {
        return func();
      } finally {
        replacing = false;
      }
    };
    connect = function(opts, host, port, cookie, cont) {
      var con;
      con = new WebSocket("ws://" + host + ":" + port);
      con.onopen = function(evt) {
        return open(evt, con, opts.data, port, cookie, cont);
      };
      con.onclose = function(evt) {
        return close(evt, opts.data);
      };
      con.onmessage = function(evt) {
        return message(evt, opts.data);
      };
      con.onerror = function(evt) {
        return showMessage(opts.editor.node, "Connection error", "Could not open connection to emacs", {
          position: {
            my: 'center top',
            at: 'center top'
          },
          buttons: {
            OK: function() {
              return $(this).dialog('close');
            }
          }
        });
      };
      _.merge(opts, {
        renderImage: renderImage
      });
      advise(opts, {
        followLink: {
          emacs: aroundMethod(function(parent) {
            return function(e) {
              if (e.target.href.match(/^elisp/)) {
                sendFollowLink(this.data.emacsConnection.websocket, this.editor.docOffset($(e.target).prev('.link')[0], 1));
                return false;
              } else {
                return parent(e);
              }
            };
          })
        }
      });
      return opts.bindings['C-C C-C'] = function(editor, e, r) {
        return sendCcCc(editor.options.data.emacsConnection.websocket, editor.docOffset(e.target, 0));
      };
    };
    renderImage = function(src, title) {
      var imgId;
      if (src.match(/^file:/)) {
        imgId = "emacs-image-" + (imgCount++);
        sendGetFile(this.data, src, function(file) {
          if (file) {
            return $("#" + imgId).prop('src', "data:" + (typeForFile(src)) + ";base64," + file);
          }
        });
        return "<img id='" + imgId + "' title='" + (escapeAttr(title)) + "'>";
      } else {
        return "<img src='" + src + "' title='" + title + "'>";
      }
    };
    typeForFile = function(name) {
      var ext, ignore, ref;
      ref = name.match(/\.(.*)$/), ignore = ref[0], ext = ref[1];
      return fileTypes[ext];
    };
    close = function(evt, data) {
      var connection;
      connection = data.emacsConnection;
      connection.panel.find('button').button('enable');
      connection.panel.find('input').removeAttr('readonly');
      if (connection.cookie) {
        window.close();
      }
      data.removeFilter(connection.filter);
      connection.websocket = null;
      return connection.filter = null;
    };
    message = function(evt, data) {
      var ignore, method, msg, ref, text;
      ref = evt.data.match(msgPat), ignore = ref[0], msg = ref[1], ignore = ref[2], text = ref[3];
      if (method = messages[msg]) {
        return preserveSelection((function(_this) {
          return function() {
            return method(data, text, evt.data);
          };
        })(this));
      } else {
        console.log("Unknown message " + msg + ": " + text);
        return data.emacsConnection.websocket.close();
      }
    };
    error = function(evt, data) {
      return console.log("Error: " + evt.data);
    };
    open = function(evt, ws, data, port, cookie, cont) {
      var connection;
      ws.send((cookie != null ? cookie : '') + " display");
      connection = data.emacsConnection;
      connection.cookie = cookie;
      connection.panel.find('button').button('disable');
      connection.panel.find('input').attr('readonly', true);
      connection.websocket = ws;
      connection.filter = {
        clear: function() {
          connection.offsetIds = [];
          return connection.idOffsets = {};
        },
        replaceBlock: function(oldBlock, newBlock) {
          var end, endOff, i, index, j, newLen, oldLen, ref, ref1, ref2, ref3, start, startOff, text;
          if (!replacing) {
            if ((index = connection.idOffsets[oldBlock != null ? oldBlock._id : void 0]) != null) {
              while (connection.offsetIds.length > index) {
                delete connection.idOffsets[connection.offsetIds.pop()];
              }
            }
            start = offsetFor(data, (ref = oldBlock != null ? oldBlock._id : void 0) != null ? ref : newBlock._id);
            end = start + ((ref1 = oldBlock != null ? oldBlock.text.length : void 0) != null ? ref1 : 0);
            text = newBlock.text;
            if (oldBlock && newBlock) {
              oldLen = oldBlock.text.length;
              newLen = newBlock.text.length;
              for (startOff = i = 0, ref2 = Math.min(oldLen, newLen); 0 <= ref2 ? i < ref2 : i > ref2; startOff = 0 <= ref2 ? ++i : --i) {
                if (oldBlock.text[startOff] !== newBlock.text[startOff]) {
                  break;
                }
              }
              start += startOff;
              for (endOff = j = 0, ref3 = Math.min(oldLen, newLen, newLen - startOff - 1, oldLen - startOff - 1); 0 <= ref3 ? j <= ref3 : j >= ref3; endOff = 0 <= ref3 ? ++j : --j) {
                if (oldBlock.text[oldLen - endOff] !== newBlock.text[newLen - endOff]) {
                  break;
                }
              }
              endOff -= 1;
              end -= endOff;
              if (startOff || endOff) {
                text = text.substring(startOff, text.length - endOff);
              }
            }
            return sendReplace(ws, start, end, text);
          }
        }
      };
      connection.filter.clear();
      data.addFilter(connection.filter);
      if (!cookie) {
        sendReplace(ws, 0, -1, data.getText());
      }
      return typeof cont === "function" ? cont() : void 0;
    };
    sendReplace = function(con, start, end, text) {
      con.send("r " + start + " " + end + " " + (JSON.stringify(text)));
      return diag("sending r " + start + " " + end + " " + (JSON.stringify(text)));
    };
    sendFollowLink = function(con, location) {
      con.send("followLink " + location);
      return diag("sending followLink " + location);
    };
    sendCcCc = function(con, location) {
      con.send("ctrl-c-ctrl-c " + location);
      return diag("sending ctrl-c-ctrl-c " + location);
    };
    sendGetFile = function(data, name, callback) {
      var con, id, m;
      con = data.emacsConnection.websocket;
      if (m = name.match(/#.*$/)) {
        name = name.substring(0, name.length - m[0].length);
      }
      id = "file-" + (fileCount++);
      diag("sending getFile " + id + " " + name);
      data.emacsConnection.fileCallbacks[id] = function(file) {
        delete data.emacsConnection.fileCallbacks[id];
        return callback(file);
      };
      return con.send("getFile " + id + " " + name);
    };
    blockRangeFor = function(data, start, end) {
      var bOff;
      bOff = data.blockOffsetForDocOffset(start);
      bOff.block = data.getBlock(bOff.block);
      bOff.length = end - start;
      bOff.type = start === end ? 'Caret' : 'Range';
      return bOff;
    };
    offsetFor = function(data, thing) {
      return data.offsetForBlock(thing);
    };
    specials = /[\b\f\n\r\t\v\"\\]/g;
    slashed = /\\./g;
    escaped = {
      '\b': "\\b",
      '\f': "\\f",
      '\n': "\\n",
      '\r': "\\r",
      '\t': "\\t",
      '\v': "\\v",
      '\"': "\\\"",
      '\\': "\\\\"
    };
    unescaped = _.zipObject((function() {
      var results;
      results = [];
      for (c in escaped) {
        e = escaped[c];
        results.push([e, c]);
      }
      return results;
    })());
    escapeString = function(str) {
      return str.replace(specials, function(c) {
        return escaped[c];
      });
    };
    unescapeString = function(str) {
      return str.replace(slashed, function(c) {
        var ref;
        return (ref = unescaped[c]) != null ? ref : c[1];
      });
    };
    configureEmacs = function(panel) {
      var data, opts;
      opts = UI.context.opts;
      data = opts.data;
      data.emacsConnection = {
        panel: panel,
        opts: UI.context.opts,
        fileCallbacks: {}
      };
      panel.find('button').button().on('click', function() {
        var host, port, ref;
        ref = panel.find('input').val().split(':'), host = ref[0], port = ref[1];
        return connect(opts, host, Number(port), '', function() {});
      });
      return $(document).ready(function() {
        var con, cookie, host, ignore, m, port, ref, theme, u;
        if (document.location.search.length > 1 && !connected) {
          connected = true;
          ref = getDocumentParams(), con = ref.connect, theme = ref.theme;
          if (con) {
            u = new URL(con);
            if (u.protocol === 'emacs:' && (m = u.pathname.match(/^\/\/([^:]*)(:[^\/]*)(\/.*)$/))) {
              ignore = m[0], host = m[1], port = m[2], cookie = m[3];
              return connect(opts, host, port.substring(1), cookie.substring(1));
            }
          }
        }
      });
    };
    mergeExports({
      offsetFor: offsetFor,
      blockRangeFor: blockRangeFor,
      configureEmacs: configureEmacs
    });
    return {
      escapeString: escapeString,
      unescapeString: unescapeString
    };
  });

}).call(this);

//# sourceMappingURL=emacs.js.map
