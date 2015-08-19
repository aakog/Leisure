// Generated by CoffeeScript 1.9.3
(function() {
  define(['cs!./editor.litcoffee', 'cs!./editorSupport.litcoffee', 'cs!./export.litcoffee'], function(Editor, EditorSupport, Exports) {
    var bindCount, checkStructure, createEditorDisplay, createStructureDisplay, diagMessage, displayStructure, editorForToolbar, errorDisplay, escapeHtml, getBlockLine, getDiagShowing, last, lineInfo, mergeExports, numSpan, posFor, showDiag, showStructureErrors, structureInfo;
    bindCount = 0;
    posFor = Editor.posFor, last = Editor.last, escapeHtml = Editor.escapeHtml;
    editorForToolbar = EditorSupport.editorForToolbar;
    mergeExports = Exports.mergeExports;
    errorDisplay = null;
    getDiagShowing = function(node) {
      var ref;
      return $((ref = editorForToolbar(node)) != null ? ref.node : void 0).nextAll(".selectionInfo").hasClass('diag');
    };
    showDiag = function(node, state) {
      var editor;
      editor = editorForToolbar(node);
      node = editor != null ? editor.node : void 0;
      editor.diag = state;
      if (state) {
        $(node).addClass('diag');
        $(node).nextAll(".editorDiag").addClass('diag');
        $(node).nextAll(".structure").addClass('diag');
        editor.options.setDiagEnabled(true);
        return editor.options.data.setDiagEnabled(true);
      } else {
        $(node).removeClass('diag');
        $(node).nextAll(".editorDiag").removeClass('diag');
        $(node).nextAll(".structure").removeClass('diag');
        editor.options.setDiagEnabled(false);
        return editor.options.data.setDiagEnabled(false);
      }
    };
    createEditorDisplay = function(editor) {
      var errors, selection, status, statusUpdate;
      status = $("<div class='editorDiag'><div class='editorErrors'></div><div class='selectionInfo'>No selection</div></div>");
      editor.node.after(status);
      errors = status.find('.editorErrors');
      selection = status.find('.selectionInfo');
      statusUpdate = (function(_this) {
        return function() {
          var block, blockLine, col, left, line, offset, ref, ref1, top;
          ref = editor.getSelectedBlockRange(), block = ref.block, offset = ref.offset;
          if (block) {
            ref1 = lineInfo(editor.options, block, offset), line = ref1.line, col = ref1.col, blockLine = ref1.blockLine, top = ref1.top, left = ref1.left;
            if (line) {
              return selection.html("line: " + (numSpan(line)) + " col: " + (numSpan(col)) + " block: " + block._id + ":" + (numSpan(blockLine)) + " top: " + (numSpan(top)) + " left: " + (numSpan(left)));
            }
          }
          return selection.html("No selection");
        };
      })(this);
      editor.on('moved', statusUpdate);
      editor.on('selection', statusUpdate);
      return editor.options.on('diag', function(badBlocks) {
        var id, j, len, ref;
        $(editor.node).find('.error').removeClass('error');
        ref = badBlocks != null ? badBlocks : [];
        for (j = 0, len = ref.length; j < len; j++) {
          id = ref[j];
          $(editor.options.nodeForId(id)).addClass('error');
        }
        if (badBlocks != null ? badBlocks.length : void 0) {
          return errors.html("BAD BLOCKS: " + (JSON.stringify(badBlocks)));
        } else {
          return errors.html('');
        }
      }).on('render', function(block) {
        if (editor.diag) {
          return console.log("RENDER: " + block._id);
        }
      });
    };
    numSpan = function(n) {
      return "<span class='status-num'>" + n + "</span>";
    };
    lineInfo = function(options, block, offset) {
      var col, docLine, holder, line, p, ref, startBlock;
      if (block) {
        ref = getBlockLine(block, offset), line = ref.line, col = ref.col;
        startBlock = block;
        docLine = line;
        while (block.prev) {
          block = options.getBlock(block.prev);
          docLine += block.text.split('\n').length - 1;
        }
        holder = options.nodeForId(startBlock._id);
        if (p = posFor(options.editor.domCursorForTextPosition(holder, offset))) {
          return {
            line: docLine,
            col: col,
            blockLine: line,
            top: Math.round(p.top),
            left: Math.round(p.left)
          };
        } else {
          return {};
        }
      } else {
        return {};
      }
    };
    getBlockLine = function(block, offset) {
      var lines, text;
      text = block.text.substring(0, offset);
      lines = text.split('\n');
      return {
        line: lines.length,
        col: last(lines).length
      };
    };
    createStructureDisplay = function(data, stop) {
      var blockDisplay, div;
      if (!$(".structure").length) {
        div = $("<div class='structure'><div class='dataErrors'></div><div class='blocks'></div></div>");
        $(document.body).append(div);
        errorDisplay = div.find('.dataErrors');
        blockDisplay = div.find('.blocks');
        return data.on('change', function(changes) {
          return displayStructure(data, blockDisplay);
        }).on('load', function() {
          return displayStructure(data, blockDisplay);
        }).on('diag', function(badBlocks) {
          $(".structure").data({
            badBlocks: badBlocks
          });
          return showStructureErrors();
        });
      }
    };
    showStructureErrors = function() {
      var b, badBlocks;
      if (errorDisplay) {
        if (badBlocks = $('.structure').data().badBlocks) {
          errorDisplay.html("<b>BAD BLOCKS:</b> " + (((function() {
            var j, len, results;
            results = [];
            for (j = 0, len = badBlocks.length; j < len; j++) {
              b = badBlocks[j];
              results.push(b[0] + ': ' + b[1]);
            }
            return results;
          })()).join(', ')));
          console.log("ADDING ERROR TO: " + ((function() {
            var j, len, results;
            results = [];
            for (j = 0, len = badBlocks.length; j < len; j++) {
              b = badBlocks[j];
              results.push(".structure.diag ." + b[0]);
            }
            return results;
          })()).join(','));
          return $(((function() {
            var j, len, results;
            results = [];
            for (j = 0, len = badBlocks.length; j < len; j++) {
              b = badBlocks[j];
              results.push(".structure.diag ." + b[0]);
            }
            return results;
          })()).join(',')).addClass('error');
        } else {
          return errorDisplay.html('');
        }
      }
    };
    diagMessage = function(editor, msg) {
      if (errorDisplay) {
        $(errorDisplay).html(msg);
      }
      return console.log(msg);
    };
    displayStructure = function(data, div) {
      $(div).html(structureInfo(data).description);
      return showStructureErrors();
    };
    structureInfo = function(data) {
      var bad, check, checks, cur, desc, i, level, levels, p, parentStack, prev, prevParent;
      parentStack = [];
      levels = {};
      desc = "";
      level = 0;
      cur = data.getBlock(data.getFirst());
      prevParent = null;
      checks = {
        nextSibling: {},
        previousSibling: {},
        prev: {}
      };
      check = cur;
      prev = null;
      while (check) {
        checks.nextSibling[check.previousSibling] = check._id;
        checks.previousSibling[check.nextSibling] = check._id;
        checks.prev[check.next] = check._id;
        prev = check;
        check = data.getBlock(check.next);
      }
      while (cur) {
        bad = [];
        if (cur.nextSibling !== checks.nextSibling[cur._id]) {
          bad.push('nextSibling');
        }
        if (cur.previousSibling !== checks.previousSibling[cur._id]) {
          bad.push('previousSibling');
        }
        if (cur.prev !== checks.prev[cur._id]) {
          bad.push('prev');
        }
        if (cur.previousSibling !== cur.prev) {
          p = cur;
          level = 0;
          while (p = data.parent(p)) {
            level++;
          }
        }
        levels[cur._id] = level;
        desc += "<span class='" + cur._id + "'>" + (((function() {
          var j, ref, results;
          results = [];
          for (i = j = 0, ref = level; 0 <= ref ? j < ref : j > ref; i = 0 <= ref ? ++j : --j) {
            results.push('   ');
          }
          return results;
        })()).join('')) + cur._id + " " + cur.type + (checkStructure(cur, bad)) + ": " + (escapeHtml(JSON.stringify(cur.text))) + "\n</span>";
        if (!cur.nextSibling) {
          level = 0;
        }
        cur = data.getBlock(cur.next);
      }
      return {
        levels: levels,
        description: desc
      };
    };
    checkStructure = function(block, bad) {
      var err;
      if (bad.length) {
        return ' <span class="err">[' + ((function() {
          var j, len, results;
          results = [];
          for (j = 0, len = bad.length; j < len; j++) {
            err = bad[j];
            results.push(err + ": " + block[err]);
          }
          return results;
        })()).join(', ') + ']</span>';
      } else {
        return '';
      }
    };
    mergeExports({
      showDiag: showDiag,
      getDiagShowing: getDiagShowing
    });
    return {
      createStructureDisplay: createStructureDisplay,
      createEditorDisplay: createEditorDisplay,
      structureInfo: structureInfo,
      showDiag: showDiag,
      getDiagShowing: getDiagShowing,
      diagMessage: diagMessage
    };
  });

}).call(this);

//# sourceMappingURL=diag.js.map
