// Generated by CoffeeScript 1.12.7
(function() {
  'use strict';
  var slice = [].slice;

  define(['handlebars', './editor', './coffee-script', 'immutable'], function(Handlebars, Editor, CoffeeScript, Immutable) {
    var Set, activateScripts, activating, addController, addView, bindView, compile, condenseHtml, configurePanels, controllers, create, defaults, dontRerender, escapeAttr, escapeHtml, findEditor, getController, getControllers, getPanel, getPendingViews, getTemplate, getTemplates, getView, hasView, imageRefreshCounter, initializePendingViews, localResources, mergeContext, nextImageSrc, nextViewId, pendingViews, preserveSelection, prevImageSrc, pushPendingInitialzation, ref, refreshImage, registerHelper, removeController, removeView, renderView, replaceImage, root, runTemplate, setPanelExpanded, showMessage, simpleRenderView, templates, touchedBlocks, traverse, viewIdCounter, viewKey, withContext;
    ref = window.Handlebars = Handlebars, compile = ref.compile, create = ref.create, registerHelper = ref.registerHelper;
    escapeHtml = Editor.escapeHtml, findEditor = Editor.findEditor, preserveSelection = Editor.preserveSelection;
    Set = Immutable.Set;
    templates = {};
    controllers = {};
    defaults = {
      controllers: {},
      templates: {}
    };
    root = null;
    activating = false;
    viewIdCounter = 0;
    pendingViews = [];
    imageRefreshCounter = 0;
    localResources = {};
    getTemplates = function(isDefault) {
      if (isDefault) {
        return defaults.templates;
      } else {
        return templates;
      }
    };
    getTemplate = function(type) {
      var ref1;
      return (ref1 = templates[type]) != null ? ref1 : defaults.templates[type];
    };
    getControllers = function(isDefault) {
      if (isDefault) {
        return defaults.controllers;
      } else {
        return controllers;
      }
    };
    getController = function(type) {
      var ref1;
      return (ref1 = controllers[type]) != null ? ref1 : defaults.controllers[type];
    };
    nextImageSrc = function(src) {
      var hashLoc, ref1, ref2, ref3, slide;
      if ((ref1 = (slide = (ref2 = root.context) != null ? (ref3 = ref2.currentView) != null ? ref3.closest('.slideholder') : void 0 : void 0)) != null ? ref1.length : void 0) {
        slide.attr('imgCount', imageRefreshCounter);
      }
      if ((hashLoc = src.indexOf('#')) === -1) {
        hashLoc = src.length;
      }
      return (src.substring(0, hashLoc)) + "#" + imageRefreshCounter;
    };
    prevImageSrc = function(src) {
      var count, hashLoc, ref1, ref2, slide;
      count = ((ref1 = (slide = (ref2 = root.context.currentView) != null ? ref2.closest('.slideholder') : void 0)) != null ? ref1.length : void 0) ? Number(slide.attr('imgCount')) : imageRefreshCounter - 1;
      if ((hashLoc = src.indexOf('#')) === -1) {
        hashLoc = src.length;
      }
      return (src.substring(0, hashLoc)) + "#" + count;
    };
    replaceImage = function(img) {
      var att, j, len, newImg, ref1;
      if (img.src.indexOf("file:") === 0) {
        newImg = document.createElement('img');
        ref1 = img.attributes;
        for (j = 0, len = ref1.length; j < len; j++) {
          att = ref1[j];
          newImg.setAttribute(att.name, att.value);
        }
        newImg.onload = function() {
          return $(img).replaceWith(newImg);
        };
        return newImg.src = nextImageSrc(img.src);
      }
    };
    refreshImage = function(img) {
      if (!img.complete) {
        return img.onerror = function() {
          return replaceImage(img);
        };
      } else if (img.complete && !img.naturalWidth) {
        return replaceImage(img);
      }
    };
    viewKey = function(type, context) {
      if (context) {
        return (type.trim()) + "/" + (context.trim());
      } else {
        return type != null ? type.trim() : void 0;
      }
    };
    addView = function(type, context, template, isDefault) {
      var name;
      getTemplates(isDefault)[name = viewKey(type, context)] = compile(template);
      return Handlebars.registerPartial(name, "{{#viewWrapper '" + name + "' this}}" + template + "{{/viewWrapper}}");
    };
    removeView = function(type, context, template, isDefault) {
      var name;
      delete getTemplates(isDefault)[name = viewKey(type, context)];
      return Handlebars.unregisterPartial(name);
    };
    getView = hasView = function(type, context) {
      return getTemplate(viewKey(type, context)) || getTemplate(type);
    };
    withContext = function(context, func) {
      var oldContext, value;
      oldContext = root.context;
      root.context = context;
      try {
        value = func();
      } finally {
        root.context = oldContext;
      }
      return value;
    };
    mergeContext = function(subcontext, func) {
      return withContext(_.merge({}, root.context, subcontext), func);
    };
    dontRerender = function(view, func) {
      var oldDonts, ref1, ref2;
      if (view) {
        oldDonts = (ref1 = (ref2 = root.context) != null ? ref2.dontRender : void 0) != null ? ref1 : new Set();
        return mergeContext({
          dontRender: oldDonts.add(view)
        }, func);
      } else {
        return func();
      }
    };
    condenseHtml = function(html, extreme) {
      if (extreme) {
        return html.replace(/>\s+</g, '><');
      } else {
        return html.replace(/>[ ]+<(?=[^\/])/g, '><').replace(/^\s*\n/gm, '').replace(/>\s+$/gm, '>').replace(/^\s+<(?=[^\/])/gm, '<');
      }
    };
    Handlebars.registerHelper('condense', function(extreme, options) {
      if (!(options && extreme)) {
        options = options || extreme;
        extreme = false;
      }
      return condenseHtml(options.fn(this), extreme);
    });
    Handlebars.registerHelper('debug', function(options) {
      debugger;
      return '';
    });
    Handlebars.registerHelper('find', function() {
      var data, item, items, j, l, len, name, options, ref1, res;
      name = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), options = arguments[j++];
      data = options.data.opts.data;
      items = name.length === 1 ? data.find(name[0]) : data.find(name[0], name[1]);
      res = "<span data-find-index='" + name[0] + "'>";
      ref1 = items != null ? items : [];
      for (l = 0, len = ref1.length; l < len; l++) {
        item = ref1[l];
        mergeContext({
          currentBlock: data.getBlock(item)
        }, function() {
          return res += options.fn(data.getYaml(item), options);
        });
      }
      return res + "</span>";
    });
    Handlebars.registerHelper('findReverse', function() {
      var data, item, items, j, l, len, name, options, ref1, res;
      name = 2 <= arguments.length ? slice.call(arguments, 0, j = arguments.length - 1) : (j = 0, []), options = arguments[j++];
      data = options.data.opts.data;
      items = name.length === 1 ? data.find(name[0]) : data.find(name[0], name[1]);
      res = '';
      ref1 = (items != null ? items : []).reverse();
      for (l = 0, len = ref1.length; l < len; l++) {
        item = ref1[l];
        res += options.fn(data.getYaml(item), options);
      }
      return res;
    });
    Handlebars.registerHelper('view', function(item, contextName, options) {
      var block, context, data, yaml;
      if (!options) {
        options = contextName;
        contextName = null;
      }
      context = options != null ? options.data : void 0;
      data = ((block = context.opts.data.getBlockNamed(item)) && (yaml = context.opts.data.getYaml(block)) ? yaml : (block = null, item));
      if (data != null ? data.type : void 0) {
        return renderView(data.type, contextName, data, null, block != null ? block : root.context.currentBlock);
      }
    });
    Handlebars.registerHelper('viewWrapper', function(name, data, opts) {
      return simpleRenderView("data-view='" + name + "' data-requested-view='" + name + "' class='view'", name, opts.fn, this);
    });
    bindView = function(view, block) {
      var i, index, input, j, len, name, opts, parent, path, ref1, ref2, results;
      if (!(opts = (ref1 = findEditor(view)) != null ? ref1.options : void 0)) {
        return;
      }
      ref2 = $(view).find('input[data-value]');
      results = [];
      for (i = j = 0, len = ref2.length; j < len; i = ++j) {
        input = ref2[i];
        path = input.getAttribute('data-value');
        if (index = path.indexOf('.')) {
          name = path.substring(0, index);
          path = path.substring(index + 1);
        } else {
          (parent = $(input).closest('[data-view-block-name]')).attr('data-view-block-name');
        }
        if (name) {
          results.push((function(name, input, path) {
            var getter, oldValue, setter;
            input.setAttribute('input-number', i);
            getter = eval("(function(data){return data." + path + "})");
            setter = eval("(function(data, value){data." + path + " = value})");
            oldValue = input.value = getter(opts.data.getYaml(opts.data.getBlockNamed(name)));
            input.onkeypress = function(e) {
              return e.stopPropagation();
            };
            input.onkeydown = function(e) {
              return e.stopPropagation();
            };
            return input.onkeyup = function(e) {
              var data, end, renderBlock, start;
              e.stopPropagation();
              if (input.value !== oldValue) {
                oldValue = typeof oldValue === 'number' ? Number(input.value) : input.value;
                data = _.clone(opts.data.getYaml(opts.data.getBlockNamed(name)), true);
                setter(data, oldValue);
                start = input.selectionStart;
                end = input.selectionEnd;
                renderBlock = function() {
                  return opts.data.allowObservation(function() {
                    var bl;
                    console.log('render', view);
                    bl = opts.data.getBlockNamed(name);
                    if (bl.local) {
                      return opts.setLocalData(name, data);
                    } else {
                      return preserveSelection(function() {
                        return opts.data.collaborativeCode.viewBoundSet(name, data);
                      });
                    }
                  });
                };
                if (block.codeAttributes.allowupdates == null) {
                  renderBlock = function() {
                    return dontRender(view, renderBlock);
                  };
                }
                return dontRerender(parent != null ? parent[0] : void 0, renderBlock);
              }
            };
          })(name, input, path));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };
    traverse = function(obj, func, t, key, path, set) {
      var directive, j, k, len, v;
      if (typeof obj === 'object') {
        if (!set) {
          set = new Set();
        }
        if (!set.has(obj)) {
          if (!path) {
            path = [];
          }
          set.add(obj);
          switch (directive = func(obj, t, key, path, set)) {
            case 'stop':
              'stop';
              break;
            case 'skip':
              break;
            default:
              path.push([key, obj]);
              if (_.isArray(obj)) {
                for (k = j = 0, len = obj.length; j < len; k = ++j) {
                  v = obj[k];
                  if (traverse(v, func, t, k, path, set) === 'stop') {
                    return;
                  }
                }
              } else {
                for (k in obj) {
                  v = obj[k];
                  if (traverse(v, func, t, k, path, set) === 'stop') {
                    return;
                  }
                }
              }
              path.pop();
          }
        }
      }
      return null;
    };
    touchedBlocks = function(html, data) {
      var v;
      v = {};
      traverse(Handlebars.parse(html), function(obj) {
        var block, blockName, d;
        if (obj.type === 'PathExpression') {
          blockName = obj.parts[0];
          if ((block = data.getBlockNamed(blockName))) {
            return v[blockName] = (d = data.getYaml(block)) ? d : null;
          }
        }
      });
      return v;
    };
    renderView = function(type, contextName, data, targets, block, blockName, addIds, extraAttrs) {
      var attr, attrs, classAttr, isTop, j, key, len, node, ref1, ref2, ref3, ref4, ref5, ref6, ref7, ref8, requestedKey, results, settings, template, value;
      if (!block && ((ref1 = root.context) != null ? (ref2 = ref1.currentBlock) != null ? ref2.yaml : void 0 : void 0) === data) {
        block = (ref3 = root.context) != null ? ref3.currentBlock : void 0;
      }
      blockName = blockName != null ? blockName : block != null ? block.codeName : void 0;
      isTop = !((ref4 = root.context) != null ? ref4.topView : void 0);
      requestedKey = key = viewKey(type, contextName);
      if (!(template = getTemplate(key))) {
        key = type;
        contextName = null;
        if (!(template = getTemplate(key))) {
          return;
        }
      }
      settings = {
        type: type,
        contextName: contextName
      };
      if (isTop) {
        settings.subviews = {};
      }
      if (!isTop && block) {
        root.context.subviews[block._id] = true;
      }
      attrs = "data-view='" + key + "' data-requested-view='" + requestedKey + "'";
      classAttr = 'view';
      ref6 = (ref5 = root.context.viewAttrs) != null ? ref5 : {};
      for (attr in ref6) {
        value = ref6[attr];
        if (attr === 'class') {
          classAttr += " " + value;
        } else {
          attrs += " " + attr + "='" + value + "'";
        }
      }
      attrs += " class='" + classAttr + "'";
      if (block && blockName) {
        attrs += " data-view-block-name='" + blockName + "'";
      } else if (block) {
        attrs += " data-view-block='" + block._id + "'";
      }
      if (extraAttrs) {
        attrs += " " + extraAttrs.trim();
      }
      if (targets) {
        results = [];
        for (j = 0, len = targets.length; j < len; j++) {
          node = targets[j];
          if ((ref7 = root.context) != null ? (ref8 = ref7.dontRender) != null ? ref8.has(node) : void 0 : void 0) {
            continue;
          }
          settings.view = node;
          results.push(mergeContext(settings, function() {
            var html, id, n;
            root.context.data = data;
            if (block) {
              root.context.block = block;
            }
            if (isTop) {
              root.context.topView = node;
            }
            id = node.id;
            html = runTemplate(template, data, {
              data: root.context
            });
            if (isTop) {
              attrs += " data-ids='" + (_.keys(settings.subviews).join(' ')) + "'";
            }
            n = $("<span " + attrs + ">" + html + "</span>");
            n[0].id = id;
            $(node).replaceWith(n);
            return root.context.opts.editor.activateScripts(n, root.context, data, block);
          }));
        }
        return results;
      } else {
        return mergeContext(settings, function() {
          return simpleRenderView(attrs, key, template, data, block, addIds);
        });
      }
    };
    runTemplate = function() {
      var args, err, ref1, template;
      template = arguments[0], args = 2 <= arguments.length ? slice.call(arguments, 1) : [];
      try {
        return template.apply(null, args);
      } catch (error) {
        err = error;
        console.log((ref1 = err.stack) != null ? ref1 : err.msg);
        return " <span class='error'>[Error in template]</span> ";
      }
    };
    nextViewId = function() {
      return "view-" + (viewIdCounter++);
    };
    simpleRenderView = function(attrs, key, template, data, block) {
      var id;
      id = nextViewId();
      (function(context) {
        return pendingViews.push(function() {
          return activateScripts($("#" + id), context, data, block);
        });
      })(root.context);
      attrs += " id='" + id + "'";
      if (block) {
        root.context.subviews[block._id] = true;
      }
      root.context.simpleViewId = id;
      return "<span " + attrs + ">" + (runTemplate(template, data, {
        data: root.context
      })) + "</span>";
    };
    initializePendingViews = function() {
      var func, j, len, p, results;
      imageRefreshCounter++;
      p = pendingViews;
      pendingViews = [];
      results = [];
      for (j = 0, len = p.length; j < len; j++) {
        func = p[j];
        results.push(func());
      }
      return results;
    };
    activateScripts = function(el, context, data, block) {
      if (!activating) {
        block = block != null ? block : context.block;
        data = data != null ? data : context.data;
        return withContext(_.merge({
          data: {
            block: block
          }
        }, context), function() {
          var err, img, j, l, len, len1, len2, len3, m, newScript, node, o, ref1, ref2, ref3, ref4, results, script;
          root.context.currentView = el;
          activating = true;
          try {
            ref1 = el.find('script');
            for (j = 0, len = ref1.length; j < len; j++) {
              script = ref1[j];
              if (!script.type || script.type === 'text/javascript') {
                newScript = document.createElement('script');
                newScript.type = 'text/javascript';
                newScript.textContent = script.textContent;
                newScript.src = script.src;
                root.currentScript = newScript;
                script.parentNode.insertBefore(newScript, script);
                script.remove();
              }
            }
            ref2 = el.find('script[type="text/coffeescript"]').add(el.find('script[type="text/literate-coffeescript"]'));
            for (l = 0, len1 = ref2.length; l < len1; l++) {
              script = ref2[l];
              root.currentScript = script;
              CoffeeScript.run(script.innerHTML);
            }
            if ((ref3 = getController(el.attr('data-view'))) != null) {
              if (typeof ref3.initializeView === "function") {
                ref3.initializeView(el, data, {
                  data: root.context
                });
              }
            }
            ref4 = el.find('img');
            for (m = 0, len2 = ref4.length; m < len2; m++) {
              img = ref4[m];
              refreshImage(img);
            }
            results = [];
            for (o = 0, len3 = el.length; o < len3; o++) {
              node = el[o];
              results.push(bindView(node, data != null ? data.block : void 0));
            }
            return results;
          } catch (error) {
            err = error;
            return console.error(err);
          } finally {
            root.currentScript = null;
            activating = false;
          }
        });
      }
    };
    addController = function(type, name, func, isDefault) {
      return getControllers(isDefault)[viewKey(type, name)] = func;
    };
    removeController = function(type, name, isDefault) {
      return delete getControllers(isDefault)[viewKey(type, name)];
    };
    getPendingViews = function() {
      return pendingViews;
    };
    pushPendingInitialzation = function(pending) {
      return pendingViews.push(pending);
    };
    getPanel = function(view) {
      return $(view).closest('.expandable-panel');
    };
    configurePanels = function(view) {
      var ep, hp;
      $(view).find('.hidden-panel').children().filter('.label').append(" <i class='fa fa-arrow-right'></i>").button();
      $(view).find('.expandable-panel').children().filter('.label').append(" <i class='fa fa-arrow-left'></i><i class='fa fa-arrow-right'></i>").button().on('click', function() {
        getPanel(this).addClass('expand');
        return getPanel(this).find("[name='hiddenFocus']")[0].focus();
      });
      ep = $(view).find('.expandable-panel');
      $("<input name='hiddenFocus' class='hiddenTextField'>").appendTo(ep);
      ep.click((function(e) {
        if (!$(e.target).closest('input,button').length) {
          return $(this).closest('.expandable-panel').find("[name='hiddenFocus']")[0].focus();
        }
      }));
      ep.children().filter('.contents').on('click', function() {
        var panel;
        panel = $(this).closest('.expandable-panel')[0];
        if (panel.hasMousedown) {
          panel.hasMousedown = false;
          if (!(document.activeElement instanceof HTMLInputElement)) {
            return $(panel).find("[name='hiddenFocus']")[0].focus();
          }
        }
      });
      ep.children().filter('.contents').on('mousedown', function() {
        return $(this).closest('.expandable-panel')[0].hasMousedown = true;
      });
      ep.find('input').focus(function() {
        return $(this).closest('.expandable-panel').addClass('expand');
      });
      ep.find('input').blur(function() {
        var panel;
        panel = $(this).closest('.expandable-panel')[0];
        if (!panel.hasMousedown && $(document.activeElement).closest('.expandable-panel')[0] !== panel) {
          return $(panel).removeClass('expand');
        }
      });
      ep.find('button').click(function() {
        return $(this).closest('.expandable-panel').addClass('contract');
      });
      hp = $(view).find('.hidden-panel');
      $("<input name='hiddenFocus' class='hiddenTextField'>").appendTo(hp);
      hp.on('click', function(e) {
        var button, panel;
        panel = $(this).closest('.hidden-panel')[0];
        if (panel.hasMousedown) {
          panel.hasMousedown = false;
          if ($(panel).hasClass('expand')) {
            button = $($(panel).children()[1]).children().first()[0];
            if (button === e.target || button.contains(e.target)) {
              return $(panel).removeClass('expand');
            }
          } else if (!(document.activeElement instanceof HTMLInputElement)) {
            return $(panel).find("[name='hiddenFocus']")[0].focus();
          }
        }
      });
      hp.on('mousedown', function() {
        return $(this).closest('.hidden-panel')[0].hasMousedown = true;
      });
      hp.find('input').focus(function() {
        return $(this).closest('.hidden-panel').addClass('expand');
      });
      return hp.find('input').blur(function() {
        var panel;
        panel = $(this).closest('.hidden-panel')[0];
        if (!panel.hasMousedown && $(document.activeElement).closest('.hidden-panel')[0] !== panel) {
          return $(panel).removeClass('expand');
        }
      });
    };
    setPanelExpanded = function(view, expand) {
      var panel;
      panel = getPanel(view);
      panel.removeClass((expand ? 'contract' : 'expand'));
      return panel.addClass((expand ? 'expand' : 'contract'));
    };
    showMessage = function(node, title, str, opts, func) {
      var dialog;
      dialog = $("<div title=" + (escapeAttr(title)) + "><div>" + str + "</div></div>").appendTo(node).dialog(_.merge({
        close: function() {
          return dialog.remove();
        }
      }, opts != null ? opts : {}));
      return typeof func === "function" ? func(dialog) : void 0;
    };
    escapeAttr = function(text) {
      return escapeHtml(text).replace(/['"&]/g, function(c) {
        switch (c) {
          case '"':
            return '&quot;';
          case "'":
            return '&#39;';
          case '&':
            return '&amp;';
        }
      });
    };
    return root = Object.assign(Leisure, {
      UI: {
        withContext: withContext,
        mergeContext: mergeContext,
        renderView: renderView,
        addView: addView,
        removeView: removeView,
        hasView: hasView,
        getView: getView,
        addController: addController,
        removeController: removeController,
        initializePendingViews: initializePendingViews,
        getPendingViews: getPendingViews,
        viewKey: viewKey,
        configurePanels: configurePanels,
        context: null,
        showMessage: showMessage,
        escapeAttr: escapeAttr,
        refreshImage: refreshImage,
        nextImageSrc: nextImageSrc,
        prevImageSrc: prevImageSrc,
        pushPendingInitialzation: pushPendingInitialzation,
        setPanelExpanded: setPanelExpanded,
        activateScripts: activateScripts,
        pendingScripts: [],
        localResources: localResources,
        nextViewId: nextViewId,
        traverse: traverse,
        touchedBlocks: touchedBlocks
      },
      condenseHtml: condenseHtml,
      Handlebars: Handlebars
    }).UI;
  });

}).call(this);

//# sourceMappingURL=ui.js.map
