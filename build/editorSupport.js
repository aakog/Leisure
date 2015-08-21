// Generated by CoffeeScript 1.9.3
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty,
    indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['cs!./base', 'cs!./org', 'cs!./docOrg.litcoffee', 'cs!./ast', 'cs!./eval.litcoffee', 'cs!./editor.litcoffee', 'lib/lodash.min', 'jquery', 'cs!./ui.litcoffee', 'handlebars', 'cs!./export.litcoffee', './lib/prism', 'cs!./advice'], function(Base, Org, DocOrg, Ast, Eval, Editor, _, $, UI, Handlebars, BrowserExports, Prism, Advice) {
    var DataStore, DataStoreEditingOptions, Fragment, Headline, Html, LeisureEditCore, Nil, OrgData, OrgEditing, actualSelectionUpdate, addChange, addController, addView, afterMethod, aroundMethod, beforeMethod, blockCodeItems, blockElementId, blockEnvMaker, blockIsHidden, blockOrg, blockSource, blockText, blockViewType, breakpoint, changeAdvice, configureMenu, controllerEval, copy, copyBlock, createBlockEnv, createLocalData, defaultEnv, defaults, documentParams, editorForToolbar, escapeAttr, escapeHtml, findEditor, followLink, getCodeItems, getDocumentParams, getId, greduce, headlineRE, initializePendingViews, installSelectionMenu, isContentEditable, isControl, isCss, isDynamic, languageEnvMaker, last, mergeContext, mergeExports, monitorSelectionChange, orgDoc, parseOrgMode, posFor, preserveSelection, removeController, removeView, renderView, selectionActive, selectionMenu, setError, setHtml, setResult, showHide, throttledUpdateSelection, toolbarFor, trickyChange, updateSelection, withContext;
    defaultEnv = Base.defaultEnv;
    parseOrgMode = Org.parseOrgMode, Fragment = Org.Fragment, Headline = Org.Headline, headlineRE = Org.headlineRE;
    orgDoc = DocOrg.orgDoc, getCodeItems = DocOrg.getCodeItems, blockSource = DocOrg.blockSource;
    Nil = Ast.Nil;
    languageEnvMaker = Eval.languageEnvMaker, Html = Eval.Html;
    LeisureEditCore = Editor.LeisureEditCore, last = Editor.last, DataStore = Editor.DataStore, DataStoreEditingOptions = Editor.DataStoreEditingOptions, blockText = Editor.blockText, posFor = Editor.posFor, escapeHtml = Editor.escapeHtml, copy = Editor.copy, setHtml = Editor.setHtml, findEditor = Editor.findEditor, copyBlock = Editor.copyBlock, preserveSelection = Editor.preserveSelection;
    changeAdvice = Advice.changeAdvice, afterMethod = Advice.afterMethod, beforeMethod = Advice.beforeMethod, aroundMethod = Advice.aroundMethod;
    addView = UI.addView, removeView = UI.removeView, renderView = UI.renderView, addController = UI.addController, removeController = UI.removeController, withContext = UI.withContext, mergeContext = UI.mergeContext, initializePendingViews = UI.initializePendingViews, escapeAttr = UI.escapeAttr;
    mergeExports = BrowserExports.mergeExports;
    selectionActive = true;
    headlineRE = /^(\*+ *)(.*)(\n)$/;
    documentParams = null;
    defaults = {
      views: {},
      controls: {}
    };
    blockOrg = function(data, blockOrText) {
      var frag, org, ref, text;
      text = typeof blockOrText === 'string' ? (ref = data.getBlock(blockOrText)) != null ? ref : blockOrText : blockOrText.text;
      org = parseOrgMode(text);
      org = org.children.length === 1 ? org.children[0] : (frag = new Fragment(org.offset, org.children), frag);
      if (typeof blockOrText === 'object') {
        org.nodeId = blockOrText._id;
        org.shared = blockOrText.type;
      }
      org.linkNodes();
      return org;
    };
    OrgData = (function(superClass) {
      extend(OrgData, superClass);

      function OrgData() {
        DataStore.apply(this, arguments);
        this.namedBlocks = {};
        this.filters = [];
      }

      OrgData.prototype.getBlock = function(thing, changes) {
        var ref;
        if (typeof thing === 'string') {
          return (ref = changes != null ? changes.sets[thing] : void 0) != null ? ref : OrgData.__super__.getBlock.call(this, thing);
        } else {
          return thing;
        }
      };

      OrgData.prototype.load = function(first, blocks, changes) {
        var block, filter, id, j, len, ref, ref1;
        if (!first) {
          return OrgData.__super__.load.call(this, first, blocks);
        } else {
          ref = this.filters;
          for (j = 0, len = ref.length; j < len; j++) {
            filter = ref[j];
            filter.clear();
          }
          if (!changes) {
            changes = {
              sets: blocks,
              oldBlocks: {},
              first: first
            };
          }
          this.linkAllSiblings(changes);
          for (block in this.blockList()) {
            this.checkChange(block, null);
          }
          ref1 = changes.sets;
          for (id in ref1) {
            block = ref1[id];
            this.runFilters(null, block);
            this.checkChange(null, block);
          }
          return OrgData.__super__.load.call(this, first, blocks);
        }
      };

      OrgData.prototype.setBlock = function(id, block) {
        this.runFilters(this.getBlock(id), block);
        return OrgData.__super__.setBlock.call(this, id, block);
      };

      OrgData.prototype.deleteBlock = function(id) {
        this.runFilters(this.getBlock(id), null);
        return OrgData.__super__.deleteBlock.call(this, id);
      };

      OrgData.prototype.addFilter = function(filter) {
        return this.filters.push(filter);
      };

      OrgData.prototype.removeFilter = function(filter) {
        return _.remove(this.filters, function(i) {
          return i === filter;
        });
      };

      OrgData.prototype.runFilters = function(oldBlock, newBlock) {
        var filter, j, len, ref, results1;
        ref = this.filters;
        results1 = [];
        for (j = 0, len = ref.length; j < len; j++) {
          filter = ref[j];
          results1.push(filter.replaceBlock(oldBlock, newBlock));
        }
        return results1;
      };

      OrgData.prototype.parseBlocks = function(text) {
        if (text === '') {
          return [];
        } else {
          return orgDoc(parseOrgMode(text.replace(/\r\n/g, '\n')));
        }
      };

      OrgData.prototype.nextSibling = function(thing, changes) {
        var ref;
        return this.getBlock((ref = this.getBlock(thing, changes)) != null ? ref.nextSibling : void 0, changes);
      };

      OrgData.prototype.previousSibling = function(thing, changes) {
        return this.getBlock(this.getBlock(thing, changes).previousSibling, changes);
      };

      OrgData.prototype.reducePreviousSiblings = function(thing, changes, func, arg) {
        return greduce(this.getBlock(thing, changes), changes, func, arg, (function(_this) {
          return function(b) {
            return _this.getBlock(b.previousSibling, changes);
          };
        })(this));
      };

      OrgData.prototype.reduceNextSiblings = function(thing, changes, func, arg) {
        return greduce(this.getBlock(thing, changes), changes, func, arg, (function(_this) {
          return function(b) {
            return _this.getBlock(b.nextSibling, changes);
          };
        })(this));
      };

      OrgData.prototype.lastSibling = function(thing, changes) {
        return this.reduceNextSiblings(thing, changes, (function(x, y) {
          return y;
        }), null);
      };

      OrgData.prototype.firstSibling = function(thing, changes) {
        return this.reducePreviousSiblings(thing, changes, (function(x, y) {
          return y;
        }), null);
      };

      OrgData.prototype.parent = function(thing, changes) {
        var ref;
        return this.getBlock((ref = this.firstSibling(thing, changes)) != null ? ref.prev : void 0, changes);
      };

      OrgData.prototype.firstChild = function(thing, changes) {
        var block, n;
        if ((block = this.getBlock(thing, changes)) && (n = this.getBlock(block.next, changes)) && !n.previousSibling) {
          return n;
        }
      };

      OrgData.prototype.lastChild = function(thing, changes) {
        return this.lastSibling(this.firstChild(thing, changes), changes);
      };

      OrgData.prototype.children = function(thing, changes) {
        var c;
        c = [];
        this.reduceNextSiblings(this.firstChild(thing, changes), changes, (function(x, y) {
          return c.push(y);
        }), null);
        return c;
      };

      OrgData.prototype.nextRight = function(thing, changes) {
        var sib;
        while (thing) {
          if (sib = this.nextSibling(thing, changes)) {
            return sib;
          }
          thing = this.parent(thing, changes);
        }
        return null;
      };

      OrgData.prototype.linkAllSiblings = function(changes) {
        var block, cur, emptyNexts, id, parent, ref, results1, sibling, stack;
        stack = [];
        parent = null;
        sibling = null;
        emptyNexts = {};
        cur = this.getBlock(changes.first, changes);
        while (cur) {
          if (cur.nextSibling) {
            emptyNexts[cur._id] = cur;
          }
          if (cur.type === 'headline') {
            while (parent && cur.level <= parent.level) {
              ref = stack.pop(), parent = ref[0], sibling = ref[1];
            }
          } else if (cur.type === 'chunk' && (cur.properties != null) && parent && !_(parent.propertiesBlocks).contains(cur._id)) {
            if (!parent.propertiesBlocks) {
              parent.propertiesBlocks = [];
            }
            parent.propertiesBlocks.push(cur._id);
          }
          if (sibling) {
            delete emptyNexts[sibling._id];
            if (sibling.nextSibling !== cur._id) {
              addChange(sibling, changes).nextSibling = cur._id;
            }
            if (cur.previousSibling !== sibling._id) {
              addChange(cur, changes).previousSibling = sibling._id;
            }
          } else if (cur.previousSibling) {
            delete addChange(cur, changes).previousSibling;
          }
          sibling = cur;
          if (cur.type === 'headline') {
            stack.push([parent, sibling]);
            parent = cur;
            sibling = null;
          }
          cur = this.getBlock(cur.next, changes);
        }
        results1 = [];
        for (id in emptyNexts) {
          block = emptyNexts[id];
          results1.push(delete addChange(block, changes).nextSibling);
        }
        return results1;
      };

      OrgData.prototype.makeChange = function(changes) {
        var block, id, removes, sets;
        sets = changes.sets, removes = changes.removes;
        for (id in removes) {
          this.checkChange(this.getBlock(id), null);
        }
        for (id in sets) {
          block = sets[id];
          this.checkChange(this.getBlock(id), block);
        }
        return OrgData.__super__.makeChange.call(this, changes);
      };

      OrgData.prototype.processDefaults = function(lorgText) {
        var block, j, len, results1, viewBlocks;
        viewBlocks = orgDoc(parseOrgMode(lorgText.replace(/\r\n?/g, '\n')));
        results1 = [];
        for (j = 0, len = viewBlocks.length; j < len; j++) {
          block = viewBlocks[j];
          results1.push(this.checkChange(null, block, true));
        }
        return results1;
      };

      OrgData.prototype.checkChange = function(oldBlock, newBlock, isDefault) {
        this.checkCssChange(oldBlock, newBlock, isDefault);
        this.checkCodeChange(oldBlock, newBlock, isDefault);
        this.checkViewChange(oldBlock, newBlock, isDefault);
        return this.checkControlChange(oldBlock, newBlock, isDefault);
      };

      OrgData.prototype.checkCssChange = function(oldBlock, newBlock, isDefault) {
        if (isCss(oldBlock) || isCss(newBlock)) {
          $("#css-" + (blockElementId(oldBlock) || blockElementId(newBlock))).filter('style').remove();
        }
        if (isCss(newBlock)) {
          return $('head').append("<style id='css-" + (blockElementId(newBlock)) + "'>" + (blockSource(newBlock)) + "</style>");
        }
      };

      OrgData.prototype.checkCodeChange = function(oldBlock, newBlock, isDefault) {
        if ((oldBlock != null ? oldBlock.codeName : void 0) !== (newBlock != null ? newBlock.codeName : void 0)) {
          if (oldBlock != null ? oldBlock.codeName : void 0) {
            delete this.namedBlocks[oldBlock.codeName];
          }
          if (newBlock != null ? newBlock.codeName : void 0) {
            return this.namedBlocks[newBlock.codeName] = newBlock._id;
          }
        }
      };

      OrgData.prototype.checkViewChange = function(oldBlock, newBlock, isDefault) {
        var ov, source, view, vt;
        removeView(ov = blockViewType(oldBlock));
        if (vt = blockViewType(newBlock)) {
          source = blockSource(newBlock);
          addView(vt, null, source.substring(0, source.length - 1));
          if (isDefault) {
            defaults.views[vt] = source.substring(0, source.length - 1);
          }
        }
        if (ov && ov !== vt && (view = defaults.views[ov])) {
          return addView(ov, null, view);
        }
      };

      OrgData.prototype.checkControlChange = function(oldBlock, newBlock, isDefault) {
        var controller, env, ov, vt;
        if ((oldBlock != null ? oldBlock.type : void 0) !== 'code' || blockSource(oldBlock) !== blockSource(newBlock) || isControl(oldBlock) !== isControl(newBlock)) {
          removeController(ov = blockViewType(oldBlock, 'control'));
          if (vt = blockViewType(newBlock, 'control')) {
            env = blockEnvMaker(newBlock)({
              __proto__: defaultEnv
            });
            controller = {};
            addController(vt, null, controller);
            env["eval"] = function(text) {
              return controllerEval.call(controller, text);
            };
            env.write = function(str) {};
            env.errorAt = function(offset, msg) {
              return console.log(msg);
            };
            return env.executeText(blockSource(newBlock), Nil, (function() {}));
          }
        }
      };

      return OrgData;

    })(DataStore);
    blockElementId = function(block) {
      return block && (block.codeName || block._id);
    };
    blockIsHidden = function(block) {
      var ref, ref1;
      return String((ref = block != null ? (ref1 = block.properties) != null ? ref1.hidden : void 0 : void 0) != null ? ref : '').toLowerCase() === 'true';
    };
    controllerEval = function(txt) {
      return eval(txt);
    };
    isCss = function(block) {
      return (block != null ? block.language : void 0) === 'css';
    };
    isControl = function(block) {
      var ref;
      return (block != null ? block.type : void 0) === 'code' && ((ref = block.codeAttributes) != null ? ref.control : void 0);
    };
    blockViewType = function(block, attr) {
      var ref;
      if (attr == null) {
        attr = 'defview';
      }
      return ((block != null ? block.type : void 0) === 'code' && ((ref = block.codeAttributes) != null ? ref[attr] : void 0)) || null;
    };
    addChange = function(block, changes) {
      if (!changes.sets[block._id]) {
        changes.oldBlocks.push = block;
        changes.newBlocks.push(changes.sets[block._id] = copy(block));
      }
      return changes.sets[block._id];
    };
    greduce = function(thing, changes, func, arg, next) {
      if (typeof changes === 'function') {
        next = arg;
        arg = func;
        func = changes;
      }
      if (thing && typeof arg === 'undefined') {
        arg = thing;
        thing = next(thing);
      }
      while (thing) {
        arg = func(arg, thing);
        thing = next(thing);
      }
      return arg;
    };
    getId = function(thing) {
      if (typeof thing === 'string') {
        return thing;
      } else {
        return thing._id;
      }
    };
    OrgEditing = (function(superClass) {
      extend(OrgEditing, superClass);

      function OrgEditing(data) {
        OrgEditing.__super__.constructor.call(this, data);
        data.on('load', (function(_this) {
          return function() {
            return _this.rerenderAll();
          };
        })(this));
        data.on('change', function() {
          return initializePendingViews();
        });
        this.setPrefix('leisureBlock-');
        this.hiding = true;
        this.setMode(Leisure.plainMode);
        this.toggledSlides = {};
      }

      OrgEditing.prototype.renderBlocks = function() {
        return this.mode.renderBlocks(this, OrgEditing.__super__.renderBlocks.call(this));
      };

      OrgEditing.prototype.setTheme = function(theme) {
        if (this.theme) {
          this.editor.node.removeClass(this.theme);
        }
        return this.editor.node.addClass(this.theme = theme);
      };

      OrgEditing.prototype.toggleSlides = function() {
        return this.mode.setSlideMode(this, !this.showingSlides());
      };

      OrgEditing.prototype.showingSlides = function() {
        return this.mode.showingSlides(this);
      };

      OrgEditing.prototype.rerenderAll = function() {
        OrgEditing.__super__.rerenderAll.call(this);
        return initializePendingViews();
      };

      OrgEditing.prototype.changed = function(changes) {
        var block, i, id, j, l, len, len1, len2, nb, newBlock, newBlocks, node, o, oldBlock, oldBlocks, ref, ref1, viewNodes;
        newBlocks = changes.newBlocks, oldBlocks = changes.oldBlocks;
        if ((newBlocks.length === (ref = oldBlocks.length) && ref === 1)) {
          for (i = j = 0, len = newBlocks.length; j < len; i = ++j) {
            newBlock = newBlocks[i];
            oldBlock = oldBlocks[i];
            if (trickyChange(oldBlock, newBlock)) {
              return OrgEditing.__super__.changed.call(this, changes);
            }
          }
          nb = newBlocks.slice();
          viewNodes = $();
          for (l = 0, len1 = newBlocks.length; l < len1; l++) {
            block = newBlocks[l];
            viewNodes = viewNodes.add(this.find("[data-view-block='" + block._id + "']"));
            viewNodes = this.findViewsForDefiner(block, viewNodes);
            viewNodes = this.findViewsForDefiner(changes.old[block._id], viewNodes);
            ref1 = this.find("[data-observe~=" + block._id + "]");
            for (o = 0, len2 = ref1.length; o < len2; o++) {
              node = ref1[o];
              if (id = this.idForNode(node)) {
                nb.push(this.getBlock(id, changes));
              }
            }
          }
          nb = _.values(_.indexBy(nb, '_id'));
          this.mode.renderChanged(this, nb, this.idPrefix, true);
          return this.withNewContext((function(_this) {
            return function() {
              var data, len3, name, q, ref2, ref3, ref4, ref5, results1, view;
              ref2 = viewNodes.filter(function(n) {
                return !nb[_this.idForNode(n)];
              });
              results1 = [];
              for (q = 0, len3 = ref2.length; q < len3; q++) {
                node = ref2[q];
                node = $(node);
                if (data = (ref3 = (block = _this.getBlock(node.attr('data-view-block')))) != null ? ref3.yaml : void 0) {
                  ref5 = ((ref4 = $(node).attr('data-requested-view')) != null ? ref4 : '').split('/'), view = ref5[0], name = ref5[1];
                  results1.push(renderView(view, name, data, node, block));
                } else {
                  results1.push(void 0);
                }
              }
              return results1;
            };
          })(this));
        } else {
          return OrgEditing.__super__.changed.call(this, changes);
        }
      };

      OrgEditing.prototype.find = function(sel) {
        return $(this.editor.node).find(sel);
      };

      OrgEditing.prototype.findViewsForDefiner = function(block, nodes) {
        var attrs, viewType;
        if (block) {
          attrs = block.type === 'code' && block.codeAttributes;
          if (attrs && (viewType = attrs.control || attrs.defview)) {
            nodes = nodes.add(this.find("[data-view='" + viewType + "']"));
            nodes = nodes.add(this.find("[data-requested-view='" + viewType + "']"));
          }
        }
        return nodes;
      };

      OrgEditing.prototype.withNewContext = function(func) {
        return mergeContext({}, (function(_this) {
          return function() {
            UI.context.opts = _this;
            UI.context.prefix = _this.idPrefix;
            return func();
          };
        })(this));
      };

      OrgEditing.prototype.initToolbar = function() {
        this.withNewContext((function(_this) {
          return function() {
            return $(_this.editor.node).before(renderView('leisure-toolbar', null, null));
          };
        })(this));
        return initializePendingViews();
      };

      OrgEditing.prototype.slideFor = function(thing) {
        var block, parent;
        block = this.data.getBlock(thing);
        while (block && !(block.type === 'headline' && block.level === 1)) {
          parent = this.data.parent(block);
          if (!parent) {
            break;
          }
          block = parent;
        }
        return block;
      };

      OrgEditing.prototype.slidesFor = function(blocks) {
        var block, j, len, slide, slides;
        slides = {};
        for (j = 0, len = blocks.length; j < len; j++) {
          block = blocks[j];
          if (slide = this.slideFor(block)) {
            slides[slide._id] = block;
          }
        }
        return slides;
      };

      OrgEditing.prototype.toggleSlide = function(id) {
        var block;
        block = this.data.getBlock(id);
        if (((block != null ? block.type : void 0) === 'headline' && block.level === 1) || (block && !block.prev)) {
          if (this.toggledSlides[id]) {
            return delete this.toggledSlides[id];
          } else {
            return this.toggledSlides[id] = true;
          }
        }
      };

      OrgEditing.prototype.isToggled = function(thing) {
        var slide;
        return (slide = this.slideFor(thing)) && this.toggledSlides[slide._id];
      };

      OrgEditing.prototype.removeToggles = function() {
        return this.toggledSlides = {};
      };

      OrgEditing.prototype.toggleHidden = function() {
        this.hiding = !this.hiding;
        return this.rerenderAll();
      };

      OrgEditing.prototype.hideHiddenSlides = function() {
        if (!this.hiding) {
          return this.toggleHidden();
        }
      };

      OrgEditing.prototype.showAllSlides = function() {
        if (this.hiding) {
          return this.toggleHidden();
        }
      };

      OrgEditing.prototype.isHidden = function(thing) {
        return blockIsHidden(this.slideFor(thing));
      };

      OrgEditing.prototype.canHideSlides = function() {
        return this.hiding && this.mode === Leisure.fancyMode;
      };

      OrgEditing.prototype.shouldHide = function(thing) {
        var slide;
        return this.canHideSlides() && (slide = this.slideFor(thing)) && this.isHidden(slide) && !this.isToggled(slide);
      };

      OrgEditing.prototype.setEditor = function(ed) {
        var opts;
        OrgEditing.__super__.setEditor.call(this, ed);
        $(ed.node).addClass('leisure-editor');
        this.setMode(this.mode);
        this.initToolbar();
        this.bindings = {
          __proto__: this.bindings,
          'C-C C-C': ((function(_this) {
            return function(editor, e, r) {
              setTimeout((function() {
                return _this.execute();
              }), 1);
              return false;
            };
          })(this))
        };
        this.bindings.PAGEUP = (function(_this) {
          return function(editor, e, r) {
            if (_this.mode.showPrevSlide(_this)) {
              e.preventDefault();
            }
            return false;
          };
        })(this);
        this.bindings.PAGEDOWN = (function(_this) {
          return function(editor, e, r) {
            if (_this.mode.showNextSlide(_this)) {
              e.preventDefault();
            }
            return false;
          };
        })(this);
        opts = this;
        changeAdvice(ed, true, {
          enter: {
            options: function(parent) {
              return function(e) {
                return opts.mode.enter(opts, parent, e);
              };
            }
          },
          handleDelete: {
            options: aroundMethod(function(parent) {
              return function(e, sel, forward) {
                return opts.mode.handleDelete(opts, parent, e, sel, forward);
              };
            })
          }
        });
        return $(this.editor.node).on('scroll', updateSelection);
      };

      OrgEditing.prototype.setMode = function(mode) {
        this.mode = mode;
        if (this.mode && this.editor) {
          this.editor.node.attr('data-edit-mode', this.mode.name);
        }
        return this;
      };

      OrgEditing.prototype.setPrefix = function(prefix) {
        this.idPrefix = prefix;
        return this.idPattern = new RegExp("^" + prefix + "(.*)$");
      };

      OrgEditing.prototype.nodeForId = function(id) {
        return $("#" + this.idPrefix + id);
      };

      OrgEditing.prototype.idForNode = function(node) {
        var ref, ref1;
        return (ref = $(node).closest('[data-block]')[0]) != null ? (ref1 = ref.id.match(this.idPattern)) != null ? ref1[1] : void 0 : void 0;
      };

      OrgEditing.prototype.parseBlocks = function(text) {
        return this.data.parseBlocks(text);
      };

      OrgEditing.prototype.renderBlock = function(block) {
        return this.mode.render(this, block, this.idPrefix);
      };

      OrgEditing.prototype.change = function(changes) {
        var change, changedProperties, child, computedProperties, id, j, l, len, len1, oldBlock, parent, props, ref, ref1, ref2;
        computedProperties = {};
        changedProperties = [];
        ref = changes.sets;
        for (id in ref) {
          change = ref[id];
          oldBlock = this.getBlock(change._id);
          if (this.checkPropertyChange(changes, change, oldBlock)) {
            changedProperties.push(change._id);
          }
          this.checkCodeChange(changes, change, oldBlock);
        }
        this.data.linkAllSiblings(changes);
        for (j = 0, len = changedProperties.length; j < len; j++) {
          change = changedProperties[j];
          if (parent = (ref1 = this.data.parent(change, changes)) != null ? ref1._id : void 0) {
            if (!computedProperties[parent]) {
              computedProperties[parent] = true;
              props = {};
              ref2 = this.data.children(parent, changes);
              for (l = 0, len1 = ref2.length; l < len1; l++) {
                child = ref2[l];
                props = _.merge(props, child.properties);
              }
              addChange(this.data.getBlock(parent, changes), changes).properties = props;
            }
          }
        }
        this.mode.handleChanges(this, changes);
        return OrgEditing.__super__.change.call(this, changes);
      };

      OrgEditing.prototype.update = function(block) {
        var oldBlock;
        oldBlock = this.getBlock(block._id);
        if (!_.isEqual(block, oldBlock)) {
          return this.change({
            first: this.data.getFirst(),
            removes: {},
            sets: _.object([[block._id, block]]),
            newBlocks: [block],
            oldBlocks: (oldBlock ? [oldBlock] : [])
          });
        }
      };

      OrgEditing.prototype.changesHidden = function(changes) {
        var change, j, len, ref;
        if (this.canHideSlides()) {
          ref = changes.oldBlocks;
          for (j = 0, len = ref.length; j < len; j++) {
            change = ref[j];
            if (this.shouldHide(change)) {
              return true;
            }
          }
        }
        return false;
      };

      OrgEditing.prototype.checkPropertyChange = function(changes, change, oldBlock) {
        var ref;
        return change.type === 'chunk' && !_.isEqual(change.properties, (ref = this.getBlock(change._id)) != null ? ref.properties : void 0);
      };

      OrgEditing.prototype.checkCodeChange = function(changes, change, oldBlock) {
        var block, env, envM, hasChange, i, j, len, newBlock, newResults, newSource, oldSource, opts, ref, ref1, result, sync;
        if (change.type === 'code' && isDynamic(change) && (envM = blockEnvMaker(change))) {
          ref = blockCodeItems(this, change), newSource = ref.source, newResults = ref.results;
          hasChange = !oldBlock || oldBlock.type !== 'code' || oldBlock.codeAttributes.results !== 'dynamic' || (oldBlock ? (oldSource = blockSource(oldBlock), newSource.content !== oldSource.content) : void 0);
          if (hasChange) {
            result = '';
            newBlock = setError(change);
            sync = true;
            env = envM({
              __proto__: defaultEnv
            });
            opts = this;
            (function(change) {
              env.errorAt = function(offset, msg) {
                newBlock = setError(change, offset, msg);
                if (newBlock !== change && !sync) {
                  return opts.change({
                    first: opts.data.getFirst(),
                    removes: {},
                    sets: change._id
                  }, newBlock);
                }
              };
              return env.write = function(str) {
                result += str;
                if (!sync) {
                  newBlock = setResult(change, str);
                  return opts.change({
                    first: opts.data.getFirst(),
                    removes: {},
                    sets: change._id
                  }, newBlock);
                }
              };
            })(change);
            env.executeText(newSource.content, Nil, function() {});
            newBlock = setResult(newBlock, result);
            changes.sets[newBlock._id] = newBlock;
            ref1 = changes.newBlocks;
            for (i = j = 0, len = ref1.length; j < len; i = ++j) {
              block = ref1[i];
              if (block._id === newBlock._id) {
                changes.newBlocks[i] = newBlock;
              }
            }
            return sync = false;
          }
        }
      };

      OrgEditing.prototype.execute = function() {
        var block, envM;
        block = this.editor.blockForCaret();
        if (block.type === 'code' && (envM = blockEnvMaker(block))) {
          return this.executeBlock(block, envM);
        }
      };

      OrgEditing.prototype.executeBlock = function(block, envM) {
        var env, newBlock, opts, result, source, sync;
        if (envM = blockEnvMaker(block)) {
          source = blockCodeItems(this, block).source;
          result = '';
          sync = true;
          env = envM({
            __proto__: defaultEnv
          });
          opts = this;
          newBlock = setError(block);
          env.errorAt = function(offset, msg) {
            newBlock = setError(block, offset, msg);
            if (newBlock !== block && !sync) {
              return opts.update(newBlock);
            }
          };
          env.write = function(str) {
            result += str;
            if (!sync) {
              return opts.update(newBlock = setResult(block, str));
            }
          };
          env.executeText(source.content, Nil, function() {});
          sync = false;
          newBlock = setResult(newBlock, result);
          if (newBlock !== block) {
            return opts.update(newBlock);
          }
        }
      };

      OrgEditing.prototype.renderImage = function(src, title) {
        var m;
        if (this.loadName && (m = src.match(/^file:(\/\/)?(.*)$/))) {
          src = new URL(m[2], this.loadName).toString();
        }
        return "<img src='" + src + "'" + title + ">";
      };

      OrgEditing.prototype.followLink = function(e) {
        if (e.target.href.match(/^elisp/)) {
          console.log("Attempt to follow elisp link at " + (this.editor.docOffset(e.target, 0)));
          alert("Elisp links not supported:\n" + e.target.href);
        } else {
          open(e.target.href);
        }
        return false;
      };

      return OrgEditing;

    })(DataStoreEditingOptions);
    trickyChange = function(oldBlock, newBlock) {
      var t;
      return oldBlock._id !== newBlock._id || (indexOf.call((t = [oldBlock.type, newBlock.type]), 'headline') >= 0 && t[0] !== t[1]) || (t[0] === 'headline' && oldBlock.level !== newBlock.level);
    };
    setResult = function(block, result) {
      var newBlock, prop, results, text, tmp, value;
      results = blockCodeItems(this, block).results;
      if (!results && ((result == null) || result === '')) {
        return block;
      } else {
        newBlock = copyBlock(block);
        text = (result == null) || result === '' ? block.text.substring(0, results.offset) + block.text.substring(results.offset + results.text.length) : results ? block.text.substring(0, results.offset + results.contentPos) + result + block.text.substring(results.offset + results.text.length) : block.text + ("#+RESULTS:\n" + result);
        tmp = orgDoc(parseOrgMode(text.replace(/\r\n/g, '\n')))[0];
        for (prop in tmp) {
          value = tmp[prop];
          newBlock[prop] = value;
        }
        return newBlock;
      }
    };
    setError = function(block, offset, msg) {
      var err, error, newBlock, prop, ref, results, text, tmp, value;
      ref = blockCodeItems(this, block), error = ref.error, results = ref.results;
      if ((offset == null) && !error) {
        return block;
      } else {
        newBlock = copyBlock(block);
        msg = msg ? msg.trim() + "\n" : void 0;
        err = "#+ERROR: " + offset + ", " + msg;
        text = error ? offset == null ? block.text.substring(0, error.offset) + block.text.substring(error.offset + error.text.length) : block.text.substring(0, error.offset) + err + block.text.substring(error.offset + error.text.length) : results ? block.text.substring(0, results.offset) + err + block.text.substring(results.offset) : block.text + err;
        tmp = orgDoc(parseOrgMode(text.replace(/\r\n/g, '\n')))[0];
        for (prop in tmp) {
          value = tmp[prop];
          newBlock[prop] = value;
        }
        return newBlock;
      }
    };
    isDynamic = function(block) {
      var ref;
      return ((ref = block.codeAttributes) != null ? ref.results : void 0) === 'dynamic';
    };
    blockEnvMaker = function(block) {
      return languageEnvMaker(block.language);
    };
    createBlockEnv = function(block, envMaker) {};
    blockCodeItems = function(data, block) {
      var org;
      if ((block != null ? block.type : void 0) === 'code') {
        org = blockOrg(data, block);
        if (org instanceof Fragment || org instanceof Headline) {
          org = org.children[0];
        }
        return getCodeItems(org);
      } else {
        return {};
      }
    };
    createLocalData = function() {
      return new OrgData();
    };
    installSelectionMenu = function() {
      $(document.body).append("<div id='selectionBubble' contenteditable='false'></div>").append("<div id='topCaretBox' contenteditable='false'></div>").append("<div id='bottomCaretBox' contenteditable='false'></div>");
      return monitorSelectionChange();
    };
    selectionMenu = "<div>\n<ul>\n  <li name='insert'><a href='javascript:void(0)'><span>Insert</span></a>\n    <ul>\n      <li><a href='javascript:void(0)'><span>Leisure</span></a></li>\n      <li><a href='javascript:void(0)'><span>YAML</span></a></li>\n      <li><a href='javascript:void(0)'><span>HTML</span></a></li>\n      <li><a href='javascript:void(0)'><span>CoffeeScript</span></a></li>\n      <li><a href='javascript:void(0)'><span>JavaScript</span></a></li>\n    </ul>\n  </li>\n</ul>\n</div>";
    configureMenu = function(menu) {
      return console.log("configure menu");
    };
    throttledUpdateSelection = _.throttle((function() {
      return actualSelectionUpdate();
    }), 30, {
      leading: true,
      trailing: true
    });
    updateSelection = function(e) {
      return throttledUpdateSelection();
    };
    actualSelectionUpdate = function() {
      var bubble, c, editor, left, p, top;
      if (selectionActive) {
        if (editor = findEditor(getSelection().focusNode)) {
          c = editor.domCursorForCaret();
          if (!c.isEmpty() && (p = c.textPosition()) && isContentEditable(c.node)) {
            left = p.left;
            top = p.top;
            bubble = $("#selectionBubble")[0];
            bubble.style.left = left + "px";
            bubble.style.top = (top - bubble.offsetHeight) + "px";
            $(document.body).addClass('selection');
            editor.trigger('selection');
            return;
          }
        }
      }
      $(document.body).removeClass('selection');
      return editor != null ? editor.trigger('selection') : void 0;
    };
    monitorSelectionChange = function() {
      $(document).on('selectionchange', updateSelection);
      $(window).on('scroll', updateSelection);
      return $(window).on('blur focus', function(e) {
        selectionActive = e.type === 'focus';
        return updateSelection();
      });
    };
    toolbarFor = function(el) {
      return $(el).closest('[data-view]')[0];
    };
    editorForToolbar = function(el) {
      return findEditor(toolbarFor(el).nextSibling);
    };
    showHide = function(toolbar) {
      var editingOpts;
      editingOpts = editorForToolbar(toolbar).options;
      editingOpts.toggleHidden();
      return editingOpts.hiding;
    };
    breakpoint = function() {
      console.log();
      return console.log("breakpoint");
    };
    isContentEditable = function(node) {
      return (node instanceof Element ? node : node.parentElement).isContentEditable;
    };
    getDocumentParams = function() {
      var j, k, len, param, ref, ref1, v;
      if (!documentParams) {
        documentParams = {};
        ref = document.location.search.substring(1).split('&');
        for (j = 0, len = ref.length; j < len; j++) {
          param = ref[j];
          ref1 = param.split('='), k = ref1[0], v = ref1[1];
          documentParams[k.toLowerCase()] = v;
        }
      }
      return documentParams;
    };
    followLink = function(e) {
      var ref;
      return ((ref = Leisure.findEditor(e.target)) != null ? ref.options.followLink(e) : void 0) || false;
    };
    mergeExports({
      findEditor: findEditor,
      showHide: showHide,
      toolbarFor: toolbarFor,
      editorForToolbar: editorForToolbar,
      breakpoint: breakpoint,
      blockOrg: blockOrg,
      parseOrgMode: parseOrgMode,
      followLink: followLink
    });
    return {
      createLocalData: createLocalData,
      OrgData: OrgData,
      OrgEditing: OrgEditing,
      installSelectionMenu: installSelectionMenu,
      blockOrg: blockOrg,
      setResult: setResult,
      setError: setError,
      toolbarFor: toolbarFor,
      editorForToolbar: editorForToolbar,
      blockCodeItems: blockCodeItems,
      escapeAttr: escapeAttr,
      blockIsHidden: blockIsHidden,
      blockEnvMaker: blockEnvMaker,
      controllerEval: controllerEval,
      getDocumentParams: getDocumentParams
    };
  });

}).call(this);

//# sourceMappingURL=editorSupport.js.map
