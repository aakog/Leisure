// Generated by CoffeeScript 1.12.7
(function() {
  var MasterHandler, MessageHandler, SlaveHandler, _, badMasterIdError, badMsgTypeError, badVersionError, crypto, diag, disapprovedError, finalhandler, guid, http, isTextMsg, masters, noTrim, path, ref, requirejs, runReplacements, s4, serveStatic, slaves, socketPrefix, sockjs, sockjsUtil, startServer, validateBatch,
    slice = [].slice,
    extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  require('source-map-support').install();

  sockjs = require('sockjs');

  sockjsUtil = require('sockjs/lib/utils');

  http = require('http');

  crypto = require('crypto');

  serveStatic = require('serve-static');

  finalhandler = require('finalhandler');

  path = require('path');

  _ = require('./lib/lodash.min');

  requirejs = require('requirejs').config({
    baseUrl: path.dirname(module.filename),
    paths: {
      immutable: 'lib/immutable-3.7.4.min'
    }
  });

  ref = requirejs('./common'), badMasterIdError = ref.badMasterIdError, badMsgTypeError = ref.badMsgTypeError, disapprovedError = ref.disapprovedError, badVersionError = ref.badVersionError, noTrim = ref.noTrim;

  runReplacements = requirejs('./ot').runReplacements;

  masters = {};

  slaves = {};

  socketPrefix = '/Leisure/(master|slave(?:-([^/]*)))';

  s4 = function() {
    var bytes, n;
    bytes = crypto.randomBytes(2);
    n = (bytes[0] + (bytes[1] << 8)).toString(16);
    while (n.length < 4) {
      n = '0' + n;
    }
    return n;
  };

  guid = function() {
    return "" + (s4()) + (s4()) + "-" + (s4()) + "-" + (s4()) + "-" + (s4()) + "-" + (s4()) + (s4()) + (s4());
  };

  diag = function() {
    var args;
    args = 1 <= arguments.length ? slice.call(arguments, 0) : [];
    return console.log.apply(console, args);
  };

  MessageHandler = (function() {
    function MessageHandler() {
      this.id = guid();
      this.messageCount = 1;
      this.lastVersionAck = -1;
    }

    MessageHandler.prototype.setConnection = function(con1) {
      this.con = con1;
      console.log(this.type + " connection: " + this.id);
      this.con.leisure = this;
      this.con.on('data', (function(_this) {
        return function(msg) {
          return _this.handleMessage(JSON.parse(msg));
        };
      })(this));
      return this.con.on('close', (function(_this) {
        return function() {
          return _this.closed();
        };
      })(this));
    };

    MessageHandler.prototype.type = 'Unknown Handler';

    MessageHandler.prototype.close = function() {
      return this.con.close();
    };

    MessageHandler.prototype.closed = function() {
      return console.log(this.type + " closed: " + this.id);
    };

    MessageHandler.prototype.send = function(msg) {
      return this.con.write(JSON.stringify(msg));
    };

    MessageHandler.prototype.sendError = function(msg) {
      msg.type = 'error';
      this.send(msg);
      return setTimeout(((function(_this) {
        return function() {
          return _this.close();
        };
      })(this)), 1);
    };

    MessageHandler.prototype.handleMessage = function(msg) {
      msg.connectionId = this.connectionId;
      if (!(msg.type in this.handler)) {
        console.log("Received bad message " + msg.type, msg);
        return this.close();
      } else {
        return this.handler[msg.type].call(this, msg);
      }
    };

    MessageHandler.prototype.handler = {
      log: function(msg) {
        return console.log(msg.msg);
      },
      replace: function(msg) {
        this.lastVersionAck = msg.parent;
        return this.master.relay(msg);
      },
      conditionalReplace: function(msg) {
        if (msg.version !== this.master.version && this.master.versionDirty) {
          return this.send({
            type: 'rejectChange',
            targetVersion: msg.targetVersion,
            version: this.version
          });
        } else {
          return this.master.relay(msg);
        }
      },
      ack: function(msg) {
        this.lastVersionAck = msg.version;
        return this.master.peerAcknowledgedVersion(msg);
      }
    };

    MessageHandler.prototype.shouldEcho = function(msg) {
      return isTextMsg(msg) && msg.connectionId === this.connectionId;
    };

    return MessageHandler;

  })();

  isTextMsg = function(msg) {
    var ref1;
    return (ref1 = msg.type) === 'replace' || ref1 === 'conditionalReplace';
  };

  validateBatch = function(replacements) {
    var i, last, len, repl;
    replacements = _.sortBy(replacements, function(x) {
      return x.start;
    });
    last = 0;
    for (i = 0, len = replacements.length; i < len; i++) {
      repl = replacements[i];
      if (repl.start < last) {
        throw new Error("Attempt to perform overlapping replacements in batch");
      }
      last = repl.end;
    }
    return replacements;
  };

  MasterHandler = (function(superClass) {
    extend(MasterHandler, superClass);

    function MasterHandler() {
      MasterHandler.__super__.constructor.call(this);
      this.master = this;
      this.connectionId = "peer-0";
      this.slaves = {};
      this.pendingSlaves = {};
      this.doc = '';
      this.peerCount = 0;
      this.version = 0;
      this.nextVersionCallbacks = [];
      this.pendingVersionAcks = {};
      this.remainingVersionAcks = 0;
      this.versionDirty = false;
      this.versionOps = [];
      this.unreplacements = [];
      this.ackedVersion = -1;
    }

    MasterHandler.prototype.type = 'Master';

    MasterHandler.prototype.setConnection = function(con) {
      masters[this.id] = this;
      MasterHandler.__super__.setConnection.call(this, con);
      return this.send({
        type: 'connect',
        id: this.id,
        connectionId: this.connectionId,
        version: this.messageCount
      });
    };

    MasterHandler.prototype.addSlave = function(slave) {
      slave.connectionId = "peer-" + (++this.peerCount);
      this.pendingSlaves[slave.connectionId] = slave;
      return this.send({
        type: 'slaveConnect',
        slaveId: slave.connectionId
      });
    };

    MasterHandler.prototype.removeSlave = function(slave) {
      delete this.slaves[slave.connectionId];
      delete this.pendingSlaves[slave.connectionId];
      this.send({
        type: 'slaveDisconnect',
        slaveId: slave.connectionId
      });
      return this.broadcast({
        type: 'connections',
        count: 1 + _.size(this.slaves)
      });
    };

    MasterHandler.prototype.closed = function() {
      var id, ref1, slave;
      delete masters[this.con.leisure.id];
      ref1 = this.slaves;
      for (id in ref1) {
        slave = ref1[id];
        slave.close();
      }
      this.slaves = {};
      return MasterHandler.__super__.closed.call(this);
    };

    MasterHandler.prototype.versionClean = function() {
      return !this.versionDirty && !this.remainingVersionAcks;
    };

    MasterHandler.prototype.startVersionInc = function() {
      if (this.versionDirty && !this.remainingVersionAcks) {
        this.pendingVersionAcks = _.clone(slaves);
        this.pendingVersionAcks[this.connectionId] = this;
        this.remainingVersionAcks = _.size(this.pendingVersionAcks);
        return this.broadcast({
          type: 'newVersion',
          version: this.version + 1
        });
      }
    };

    MasterHandler.prototype.peerAcknowledgedVersion = function(msg) {
      return this.trimVersions();
    };

    MasterHandler.prototype.connection = function(msg) {
      if (msg.connectionId === this.connectionId) {
        return this;
      } else {
        return this.slaves[msg.connectionId];
      }
    };

    MasterHandler.prototype.relay = function(msg) {
      var end, i, len, offset, ref1, repl, start, text;
      if (msg.type === 'replace') {
        start = msg.start, end = msg.end, text = msg.text;
        this.versionOps.push(msg);
        this.trimVersions();
      } else if (msg.type === 'conditionalReplace') {
        msg.replacements = validateBatch(msg.replacements);
        offset = 0;
        ref1 = msg.replacements;
        for (i = 0, len = ref1.length; i < len; i++) {
          repl = ref1[i];
          this.doc = this.doc.substring(0, repl.start + offset) + repl.text + this.doc.substring(repl.end + offset);
          offset += repl.text.length - repl.end + repl.start;
        }
      }
      return this.broadcast(msg);
    };

    MasterHandler.prototype.trimVersions = function() {
      var i, id, len, minVersion, op, pos, ref1, ref2, results, slave;
      if (noTrim) {
        return;
      }
      minVersion = this.lastVersionAck;
      ref1 = this.slaves;
      for (id in ref1) {
        slave = ref1[id];
        minVersion = Math.min(minVersion, slave.lastVersionAck);
      }
      ref2 = this.versionOps;
      results = [];
      for (pos = i = 0, len = ref2.length; i < len; pos = ++i) {
        op = ref2[pos];
        if (op.version >= minVersion) {
          if (pos > 0) {
            this.updateDoc(this.versionOps.slice(0, pos));
            this.unreplacements = [];
            this.versionOps = this.versionOps.slice(pos);
            this.updateDoc();
            this.broadcast({
              type: 'trimVersions',
              version: minVersion
            });
          }
          break;
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    MasterHandler.prototype.replace = function(start, end, text) {
      return this.doc = this.doc.substring(0, start) + text + this.doc.substring(end);
    };

    MasterHandler.prototype.updateDoc = function(changes) {
      var i, ref1, repl;
      ref1 = this.unreplacements;
      for (i = ref1.length - 1; i >= 0; i += -1) {
        repl = ref1[i];
        this.replace(repl.start, repl.end, repl.text);
      }
      this.unreplacements = [];
      return runReplacements(changes || this.versionOps, (function(_this) {
        return function(start, end, text) {
          _this.unreplacements.push({
            start: start,
            end: start + text.length,
            text: _this.doc.substring(start, end)
          });
          return _this.replace(start, end, text);
        };
      })(this));
    };

    MasterHandler.prototype.sendEchoIfNeeded = function(msg) {
      var con;
      if (isTextMsg(msg) && (con = this.connection(msg))) {
        con.send({
          type: 'echo',
          version: msg.version
        });
        return con;
      }
    };

    MasterHandler.prototype.broadcast = function(msg) {
      var echoer, id, ref1, results, slave;
      msg.version = ++this.messageCount;
      if ((echoer = this.sendEchoIfNeeded(msg)) !== this) {
        this.send(msg);
      }
      ref1 = this.slaves;
      results = [];
      for (id in ref1) {
        slave = ref1[id];
        if (echoer !== slave) {
          results.push(slave.send(msg));
        } else {
          results.push(void 0);
        }
      }
      return results;
    };

    MasterHandler.prototype.handler = {
      __proto__: MessageHandler.prototype.handler,
      initDoc: function(arg) {
        this.doc = arg.doc;
      },
      slaveApproval: function(arg) {
        var approval, slave, slaveId;
        slaveId = arg.slaveId, approval = arg.approval;
        if (slave = this.pendingSlaves[slaveId]) {
          delete this.pendingSlaves[slaveId];
          if (approval) {
            this.slaves[slaveId] = slave;
            slave.send({
              type: 'connect',
              id: this.id,
              connectionId: slave.connectionId,
              doc: this.doc,
              version: this.messageCount
            });
            return this.broadcast({
              type: 'connections',
              count: 1 + _.size(this.slaves)
            });
          } else {
            return slave.sendError(disapprovedError());
          }
        }
      }
    };

    return MasterHandler;

  })(MessageHandler);

  SlaveHandler = (function(superClass) {
    extend(SlaveHandler, superClass);

    function SlaveHandler() {
      return SlaveHandler.__super__.constructor.apply(this, arguments);
    }

    SlaveHandler.prototype.type = 'Slave';

    SlaveHandler.prototype.setConnection = function(con, masterId) {
      if (!(this.master = masters[masterId])) {
        this.sendError(badMasterIdError(masterId));
      } else {
        this.master.addSlave(this);
      }
      return SlaveHandler.__super__.setConnection.call(this, con);
    };

    SlaveHandler.prototype.setId = function(id1) {
      this.id = id1;
    };

    SlaveHandler.prototype.closed = function() {
      this.master.removeSlave(this);
      return SlaveHandler.__super__.closed.call(this);
    };

    return SlaveHandler;

  })(MessageHandler);

  startServer = function(port) {
    var fileServer, http_server;
    console.log('serve: ' + path.dirname(process.cwd()));
    fileServer = serveStatic(path.dirname(process.cwd()), {
      index: ['index.html']
    });
    http_server = http.createServer(function(req, res) {
      return fileServer(req, res, finalhandler(req, res));
    });
    sockjs.createServer({
      sockjs_url: 'http://cdn.jsdelivr.net/sockjs/1.0.1/sockjs.min.js',
      prefix: socketPrefix
    }).on('connection', function(con) {
      var ignore, masterId, ref1, type;
      ref1 = con.pathname.match(socketPrefix), ignore = ref1[0], type = ref1[1], masterId = ref1[2];
      if (type === 'master') {
        return new MasterHandler().setConnection(con);
      } else {
        return new SlaveHandler().setConnection(con, masterId);
      }
    }).installHandlers(http_server);
    return http_server.listen(port, '0.0.0.0');
  };

  module.exports = {
    startServer: startServer,
    guid: guid
  };

}).call(this);

//# sourceMappingURL=server.js.map
