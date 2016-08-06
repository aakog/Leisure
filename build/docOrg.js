// Generated by CoffeeScript 1.10.0
(function() {
  var indexOf = [].indexOf || function(item) { for (var i = 0, l = this.length; i < l; i++) { if (i in this && this[i] === item) return i; } return -1; };

  define(['./org', 'lib/js-yaml', 'lib/lazy'], function(Org, Yaml, Lazy) {
    var Drawer, Fragment, HTML, Headline, Keyword, Meat, ParsedCodeBlock, Results, Source, UnknownDeclaration, _L, blockOrg, blockSource, checkMerged, checkProps, checkSingleNode, createChildrenDocs, createCodeBlockDoc, createDocFromOrg, createHtmlBlockDoc, createOrgDoc, crnl, docRoot, dump, escapeRegexp, getCodeItems, getSourceNodeType, isCodeBlock, isMergeable, isSourceEnd, isText, isYaml, isYamlResult, lineCodeBlockType, linkDocs, orgDoc, parseOrgMode, replaceOrgDoc, safeLoad;
    Headline = Org.Headline, Source = Org.Source, HTML = Org.HTML, Keyword = Org.Keyword, Drawer = Org.Drawer, Meat = Org.Meat, UnknownDeclaration = Org.UnknownDeclaration, Results = Org.Results, parseOrgMode = Org.parseOrgMode, Fragment = Org.Fragment;
    safeLoad = Yaml.safeLoad, dump = Yaml.dump;
    _L = Lazy._;
    ParsedCodeBlock = (function() {
      function ParsedCodeBlock(block) {
        if (typeof block === 'string') {
          this.setBlockText(block);
        } else {
          this.init(block);
        }
      }

      ParsedCodeBlock.prototype.clone = function() {
        return new ParsedCodeBlock(this.block);
      };

      ParsedCodeBlock.prototype.getOrg = function() {
        return blockOrg(this.block);
      };

      ParsedCodeBlock.prototype.toString = function() {
        return "Parsed:\n  " + (this.block.text.replace(/\n/g, '\n  '));
      };

      ParsedCodeBlock.prototype.init = function(block1) {
        var org;
        this.block = block1;
        org = blockOrg(this.block);
        if (org instanceof Fragment || org instanceof Headline) {
          org = org.children[0];
        }
        return this.items = getCodeItems(org);
      };

      ParsedCodeBlock.prototype.setBlockText = function(str) {
        var bl, ref;
        if ((bl = orgDoc(parseOrgMode(str.replace(/\r\n/g, '\n')))).length !== 1 || bl[0].text !== str) {
          throw new Error("Bad code block: '" + str + "'");
        }
        bl[0]._id = (ref = this.block) != null ? ref._id : void 0;
        return this.init(bl[0]);
      };

      ParsedCodeBlock.prototype.spliceItem = function(itemName, str) {
        var item;
        if (str && _.last(str) !== '\n') {
          str += '\n';
        }
        item = this.items[itemName];
        return this.setBlockText(item ? this.block.text.substring(0, item.offset) + str + this.block.text.substring(item.offset + item.text.length) : this.block.text + ("#+" + (itemName.toUpperCase()) + ":\n" + str));
      };

      ParsedCodeBlock.prototype.setCodeInfo = function(info) {
        var infoStart, source, text;
        text = this.block.text;
        source = this.items.source;
        infoStart = source.offset + source.infoPos;
        return this.setBlockText(text.substring(0, infoStart) + info + text.substring(infoStart + source.info.length));
      };

      ParsedCodeBlock.prototype.setCodeAttribute = function(name, value) {
        var info, m, prefix, ref, ref1, suffix;
        info = (ref = this.items.source.info) != null ? ref : '';
        return this.setCodeInfo(((ref1 = this.block.codeAttributes) != null ? ref1[name.toLowerCase()] : void 0) != null ? (m = info.match(new RegExp("^((|.*\\S)(\\s*))(:" + (escapeRegexp(name)) + ")((\\s+[^:]*)?(?=:|$))", 'i')), prefix = m.index + m[1].length + m[4].length, suffix = info.substring(prefix + m[5].length), suffix ? suffix = ' ' + suffix : void 0, value == null ? info.substring(0, m.index + m[2].length) + suffix : info.substring(0, prefix) + ' ' + value + suffix) : value == null ? info : info + (" :" + name) + (value ? ' ' + value : ''));
      };

      ParsedCodeBlock.prototype.setResults = function(str) {
        return this.spliceItem('results', str);
      };

      ParsedCodeBlock.prototype.setSource = function(str) {
        return this.spliceItem('source', str);
      };

      ParsedCodeBlock.prototype.setError = function(str) {
        return this.spliceItem('error', str);
      };

      ParsedCodeBlock.prototype.addResultType = function(str) {
        var ref, results, types;
        types = this.getResultTypes();
        if (!(indexOf.call(types, str) >= 0)) {
          results = (ref = this.block.codeAttributes) != null ? ref.results : void 0;
          return this.setCodeAttribute('results', results ? results + " " + str : str);
        }
      };

      ParsedCodeBlock.prototype.removeResultType = function(str) {
        var end, i, j, k, len, prefix, ref, ref1, ref2, ref3, ref4, res, start, types, values;
        res = (ref = this.block.codeAttributes) != null ? ref.results : void 0;
        types = this.getResultTypes();
        if (ref1 = str.toLowerCase(), indexOf.call(types, ref1) >= 0) {
          values = res.toLowerCase().split(/(\s+)/);
          start = values.indexOf(str.toLowerCase());
          end = start + 1;
          if (start > 0) {
            start--;
          } else if (end < values.length) {
            end++;
          }
          prefix = 0;
          for (i = j = 0, ref2 = start; 0 <= ref2 ? j < ref2 : j > ref2; i = 0 <= ref2 ? ++j : --j) {
            prefix += values[i].length;
          }
          len = 0;
          for (i = k = ref3 = start, ref4 = end; ref3 <= ref4 ? k < ref4 : k > ref4; i = ref3 <= ref4 ? ++k : --k) {
            len += values[i].length;
            values[i] = false;
          }
          return this.setCodeAttribute('results', _.some(values) ? res.substring(0, prefix) + res.substring(prefix + len) : void 0);
        }
      };

      ParsedCodeBlock.prototype.setResultView = function(viewStr) {
        var m, newRes, ref, res;
        if (viewStr) {
          viewStr = ' ' + viewStr;
        }
        res = (ref = this.block.codeAttributes) != null ? ref.results : void 0;
        newRes = (m = res.match(/\s*\bview(\(.*\)|\b)/)) ? res.substring(0, m.index) + viewStr + res.substring(m.index + m[0].length) : viewStr ? res + viewStr : res;
        return this.setCodeAttribute('results', newRes);
      };

      ParsedCodeBlock.prototype.setExports = function(code, results) {
        return this.setCodeAttribute('exports', !code || !results ? (code && 'code') || (results && 'results') || 'none' : void 0);
      };

      ParsedCodeBlock.prototype.exportsCode = function() {
        var ref;
        return (ref = this.getExports()) === 'code' || ref === 'both';
      };

      ParsedCodeBlock.prototype.exportsResults = function() {
        var ref;
        return (ref = this.getExports()) === 'results' || ref === 'both';
      };

      ParsedCodeBlock.prototype.getExports = function() {
        var ref, ref1;
        return ((ref = this.block.codeAttributes) != null ? (ref1 = ref.exports) != null ? ref1.toLowerCase() : void 0 : void 0) || 'both';
      };

      ParsedCodeBlock.prototype.getResultTypes = function() {
        var ref, ref1, ref2;
        return (ref = (ref1 = this.block.codeAttributes) != null ? (ref2 = ref1.results) != null ? ref2.toLowerCase().split(' ') : void 0 : void 0) != null ? ref : [];
      };

      ParsedCodeBlock.prototype.setDynamic = function(state) {
        if (this.isDynamic() !== state) {
          if (state) {
            return this.addResultType('dynamic');
          } else {
            return this.removeResultType('dynamic');
          }
        }
      };

      ParsedCodeBlock.prototype.isDynamic = function() {
        return indexOf.call(this.getResultTypes(), 'dynamic') >= 0;
      };

      ParsedCodeBlock.prototype.setSourceContent = function(newContent) {
        var src;
        src = this.items.source;
        return this.setSource("" + (src.text.substring(0, src.contentPos)) + newContent + (src.text.substring(src.contentPos + src.content.length)));
      };

      ParsedCodeBlock.prototype.hasExpected = function() {
        return this.items.expected;
      };

      ParsedCodeBlock.prototype.resultsAreExpected = function() {
        return this.items.expected && this.items.results && this.items.expected.content() === this.items.results.content();
      };

      ParsedCodeBlock.prototype.makeResultsExpected = function() {
        var item, newExpected, source;
        if (this.items.results) {
          newExpected = ":expected:\n" + (this.items.results.content()) + ":end:\n";
          item = this.items.expected;
          return this.setBlockText(item ? this.block.text.substring(0, item.offset) + newExpected + this.block.text.substring(item.offset + item.text.length) : (source = this.items.source, this.block.text.substring(0, source.offset + source.text.length) + newExpected + this.block.text.substring(source.offset + source.text.length)));
        }
      };

      ParsedCodeBlock.prototype.clearExpected = function() {
        var item;
        if (item = this.items.expected) {
          return this.setBlockText(this.block.text.substring(0, item.offset) + this.block.text.substring(item.offset + item.text.length));
        }
      };

      return ParsedCodeBlock;

    })();
    escapeRegexp = function(str) {
      return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
    };
    blockOrg = function(block) {
      var frag, org, text;
      text = typeof block === 'string' ? block : block.text;
      org = parseOrgMode(text);
      org = org.children.length === 1 ? org.children[0] : (frag = new Fragment(org.offset, org.children), frag);
      if (typeof block === 'object') {
        org.nodeId = block._id;
        org.shared = block.type;
      }
      org.linkNodes();
      return org;
    };
    getCodeItems = function(org) {
      var result, type;
      if (!getSourceNodeType(org)) {
        return {};
      } else {
        result = {};
        while (!isSourceEnd(org)) {
          if (type = getSourceNodeType(org)) {
            if (type === 'html') {
              if (result.first) {
                return result;
              } else {
                return {
                  source: org,
                  first: org,
                  last: org
                };
              }
            }
            if (!result.first) {
              result.first = org;
            } else if (type === 'name') {
              return result;
            }
            if (result[type] != null) {
              return result;
            }
            result.last = result[type] = org;
            if (type === 'name' && org.next.constructor === Meat && org.next.next instanceof Source) {
              result.doc = org.next;
            }
            if (type === 'results') {
              break;
            }
          } else if (org instanceof Drawer || org instanceof Keyword || org instanceof UnknownDeclaration) {
            break;
          }
          org = org.next;
        }
        if (result.source) {
          return result;
        } else {
          return {};
        }
      }
    };
    isCodeBlock = function(org) {
      var first;
      if (org instanceof Keyword && org.name.match(/^name$/i)) {
        first = getCodeItems(org).first;
        return first;
      } else {
        return org instanceof Source;
      }
    };
    getSourceNodeType = function(org) {
      if (org instanceof Source) {
        return 'source';
      } else if (org instanceof HTML) {
        return 'html';
      } else if (org instanceof Results) {
        return 'results';
      } else if (org instanceof Drawer && org.name.toLowerCase() === 'expected') {
        return 'expected';
      } else if (org instanceof Keyword && org.name.match(/^name$/i)) {
        return 'name';
      } else if (org instanceof Keyword && org.name.match(/^error$/i)) {
        return 'error';
      } else {
        return false;
      }
    };
    isSourceEnd = function(org) {
      return !org || org instanceof Headline;
    };
    createDocFromOrg = function(org, collection, reloading, filter) {
      var block, doc;
      doc = orgDoc(org);
      if (filter != null) {
        doc = (function() {
          var j, len1, results1;
          results1 = [];
          for (j = 0, len1 = doc.length; j < len1; j++) {
            block = doc[j];
            results1.push(filter(block));
          }
          return results1;
        })();
      }
      replaceOrgDoc(doc, collection, reloading);
      return collection;
    };
    docRoot = function(collection) {
      var ref, ref1;
      return (ref = ((ref1 = collection.leisure) != null ? ref1 : collection.leisure = {}).info) != null ? ref : (collection.leisure.info = collection.findOne({
        info: true
      }));
    };
    replaceOrgDoc = function(docArray, collection, reloading) {
      var doc, info, j, len1, results1;
      if (reloading) {
        collection.remove({
          info: {
            '$exists': false
          }
        });
      } else {
        collection.remove();
      }
      linkDocs(docArray);
      if (reloading) {
        info = collection.leisure.info;
        info.head = docArray.length > 0 ? docArray[0]._id : null;
        collection.update(info._id, info);
      } else {
        info = collection.leisure.info = {
          info: true,
          head: docArray.length > 0 ? docArray[0]._id : null,
          _id: new Meteor.Collection.ObjectID().toJSONValue()
        };
        collection.insert(info);
      }
      results1 = [];
      for (j = 0, len1 = docArray.length; j < len1; j++) {
        doc = docArray[j];
        results1.push(collection.insert(doc));
      }
      return results1;
    };
    linkDocs = function(docs) {
      var doc, j, len1, prev, results1;
      prev = null;
      results1 = [];
      for (j = 0, len1 = docs.length; j < len1; j++) {
        doc = docs[j];
        doc._id = new Meteor.Collection.ObjectID().toJSONValue();
        if (prev) {
          prev.next = doc._id;
          doc.prev = prev._id;
        }
        results1.push(prev = doc);
      }
      return results1;
    };
    orgDoc = function(org) {
      return createOrgDoc(org, false)[0].toArray();
    };
    lineCodeBlockType = function(line) {
      var type;
      type = line && root.matchLine(line);
      if (type === 'srcStart' || type === 'srcEnd' || type === 'htmlStart' || type === 'htmlEnd') {
        return 'code';
      } else if (line.match(/^#+name:/i)) {
        return 'code';
      } else if (type === 'headline-1') {
        return 'headline';
      } else {
        return 'chunk';
      }
    };
    createOrgDoc = function(org, local) {
      var children, next, ref, ref1, result;
      next = org.next;
      if (org instanceof Headline) {
        local = local || (org.level === 1 && org.properties.local);
        children = createChildrenDocs(org, local);
        result = org.level === 0 ? (org.children.length && children) || _L([
          {
            text: '\n',
            type: 'chunk',
            offset: org.offset
          }
        ]) : _L([
          {
            text: org.text,
            type: 'headline',
            level: org.level,
            offset: org.offset,
            properties: org.properties
          }
        ]).concat(children);
      } else if (org instanceof HTML) {
        ref = createHtmlBlockDoc(org), result = ref[0], next = ref[1];
      } else if (isCodeBlock(org)) {
        ref1 = createCodeBlockDoc(org), result = ref1[0], next = ref1[1];
      } else {
        result = _L(checkProps(org, [
          {
            text: org.allText(),
            type: 'chunk',
            offset: org.offset
          }
        ]));
      }
      if (local) {
        result.each(function(item) {
          return item.local = true;
        });
      }
      return [result, next];
    };
    checkProps = function(org, block) {
      if (typeof org.isProperties === "function" ? org.isProperties() : void 0) {
        return block.properties = org.properties();
      }
    };
    createChildrenDocs = function(org, local) {
      var child, childDoc, children, mergedText, offset, properties, ref, ref1, ref2;
      children = _L();
      child = org.children[0];
      if (child) {
        mergedText = '';
        properties = _L();
        offset = org.children[0].offset;
        while (child) {
          if (isMergeable(child)) {
            mergedText += child.allText();
            if (typeof child.properties === "function" ? child.properties() : void 0) {
              properties = properties.merge(typeof child.properties === "function" ? child.properties() : void 0);
            }
            child = child.next;
          } else {
            ref = checkMerged(mergedText, properties, children, offset), mergedText = ref[0], properties = ref[1], children = ref[2];
            ref1 = createOrgDoc(child, local), childDoc = ref1[0], child = ref1[1];
            children = children.concat([childDoc]);
            offset = child != null ? child.offset : void 0;
          }
        }
        ref2 = checkMerged(mergedText, properties, children, offset), mergedText = ref2[0], properties = ref2[1], children = ref2[2];
      }
      return children;
    };
    isMergeable = function(org) {
      return !(org instanceof Headline || org instanceof HTML || isCodeBlock(org));
    };
    checkMerged = function(mergedText, properties, children, offset) {
      var child;
      if (mergedText !== '') {
        child = {
          text: mergedText,
          type: 'chunk',
          offset: offset
        };
        if (!properties.isEmpty()) {
          child.properties = properties.toObject();
        }
        children = children.concat([child]);
      }
      return ['', _L(), children];
    };
    createCodeBlockDoc = function(org) {
      var attr, err, error, expected, first, firstOffset, l, last, name, nm, obj, ref, ref1, ref2, results, source, text, val, yamlSrc;
      text = '';
      ref = getCodeItems(org), first = ref.first, name = ref.name, source = ref.source, last = ref.last, expected = ref.expected, results = ref.results;
      if (!first) {
        return [
          _L([
            {
              text: org.allText(),
              type: 'chunk',
              offset: org.offset
            }
          ]), org.next
        ];
      } else {
        firstOffset = first.offset;
        while (first !== last.next) {
          text += first.allText();
          first = first.next;
        }
        obj = {
          text: text,
          type: 'code',
          offset: firstOffset
        };
        if (source.attributes()) {
          attr = {};
          ref1 = source.attributes();
          for (nm in ref1) {
            val = ref1[nm];
            attr[nm.toLowerCase()] = val;
          }
        } else {
          attr = null;
        }
        obj.codeAttributes = attr;
        obj.codePrelen = source.contentPos + source.offset - firstOffset;
        obj.codePostlen = text.length - obj.codePrelen - source.content.length;
        if (expected) {
          obj.codeContent = source.content;
          obj.codeTestActual = results.content();
          obj.codeTestExpected = expected.content();
          obj.codeTestResult = !results ? 'unknown' : expected.content() === results.content() ? 'pass' : 'fail';
        }
        if (name) {
          obj.codeName = name.info.trim();
        }
        if (((ref2 = obj.codeAttributes) != null ? ref2.local : void 0) != null) {
          obj.local = true;
        }
        if (l = source.lead()) {
          obj.language = l.trim();
        }
        if (isYamlResult(obj) || isYaml(source)) {
          yamlSrc = (isYaml(source) && !results ? source.content : (obj.computedYaml = true, results != null ? results.content().replace(/^: /gm, '') : void 0));
          if (yamlSrc) {
            try {
              obj.yaml = safeLoad(yamlSrc);
            } catch (error) {
              err = error;
            }
          }
        } else if (isText(source)) {
          obj.yaml = source.content;
        }
        return [_L([obj]), last.next];
      }
    };
    createHtmlBlockDoc = function(org) {
      var a, obj, text;
      text = org.allText();
      obj = {
        text: text,
        type: 'code',
        offset: org.offset
      };
      obj.codePrelen = org.contentPos;
      obj.codePostlen = text.length - obj.codePrelen - org.contentLength;
      obj.language = 'html';
      if (a = org.attributes()) {
        obj.codeAttributes = a;
      }
      return [_L([obj]), org.next];
    };
    isYaml = function(org) {
      return org instanceof Source && org.info.match(/^ *yaml\b/i);
    };
    isYamlResult = function(block) {
      var ref, ref1, ref2;
      return ((ref = block.codeAttributes) != null ? (ref1 = ref.results) != null ? ref1.match(/\byaml\b/) : void 0 : void 0) || ((ref2 = block.codeAttributes) != null ? ref2.post : void 0);
    };
    isText = function(org) {
      return org instanceof Source && org.info.match(/^ *(text|string)\b/i);
    };
    checkSingleNode = function(text) {
      var docJson, docs, org;
      docs = {};
      org = parseOrgMode(text);
      docJson = (org.children.length > 1 ? orgDoc(org) : orgDoc(org.children[0]))[0];
      return docJson;
    };
    crnl = function(data) {
      if (typeof data === 'string') {
        return data.replace(/\r\n/g, '\n');
      } else if (data.text) {
        data.text = crnl(data.text);
        return data;
      } else {
        return data;
      }
    };
    blockSource = function(block) {
      return block && block.text.substring(block.codePrelen, block.text.length - block.codePostlen);
    };
    return {
      getCodeItems: getCodeItems,
      isCodeBlock: isCodeBlock,
      createDocFromOrg: createDocFromOrg,
      checkSingleNode: checkSingleNode,
      orgDoc: orgDoc,
      docRoot: docRoot,
      linkDocs: linkDocs,
      isYaml: isYaml,
      isText: isText,
      crnl: crnl,
      lineCodeBlockType: lineCodeBlockType,
      blockSource: blockSource,
      ParsedCodeBlock: ParsedCodeBlock,
      blockOrg: blockOrg
    };
  });

}).call(this);

//# sourceMappingURL=docOrg.js.map
