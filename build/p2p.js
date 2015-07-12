// Generated by CoffeeScript 1.9.3
(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  define(['jquery', 'immutable', 'cs!./lib/webrtc.litcoffee', 'lib/cycle', 'cs!./editor.litcoffee', 'cs!./editorSupport.litcoffee'], function(jq, immutable, Peer, cycle, Editor, Support) {
    var Connection, DataStore, MC, Map, MasterConnection, OrgData, P2POrgData, PeerConnection, SC, SlaveConnection, getFirst, preserveSelection, setFirst;
    Map = (window.Immutable = immutable).Map;
    PeerConnection = Peer.PeerConnection, MasterConnection = Peer.MasterConnection, SlaveConnection = Peer.SlaveConnection;
    DataStore = Editor.DataStore, preserveSelection = Editor.preserveSelection;
    OrgData = Support.OrgData;
    P2POrgData = (function(superClass) {
      extend(P2POrgData, superClass);

      function P2POrgData(peer1) {
        this.peer = peer1;
        P2POrgData.__super__.constructor.call(this);
        this.blocks = new Map();
      }

      P2POrgData.prototype.getFirst = function() {
        return getFirst(this.blocks);
      };

      P2POrgData.prototype.setFirst = function(firstId) {
        return this.blocks = setFirst(this.blocks, firstId);
      };

      P2POrgData.prototype.getBlock = function(id, changes) {
        var ref;
        if (typeof id !== 'string') {
          return id;
        } else {
          return (ref = changes != null ? changes.sets[id] : void 0) != null ? ref : this.blocks.get(id);
        }
      };

      P2POrgData.prototype.setBlock = function(id, block) {
        this.runFilters(this.getBlock(id), block);
        return this.blocks = this.blocks.set(id, block);
      };

      P2POrgData.prototype.deleteBlock = function(id) {
        this.runFilters(this.getBlock(id), null);
        return this.blocks = this.blocks["delete"](id);
      };

      P2POrgData.prototype.eachBlock = function(func) {
        return this.blocks.forEach(function(block, id) {
          if (id !== 'FIRST') {
            return func(block, id);
          }
        });
      };

      P2POrgData.prototype.load = function(first, newBlocks) {
        return P2POrgData.__super__.load.call(this, first, setFirst(new Map(newBlocks), first), {
          sets: newBlocks,
          oldBlocks: {},
          first: first
        });
      };

      P2POrgData.prototype.makeChange = function(change) {
        var ch;
        ch = P2POrgData.__super__.makeChange.call(this, change);
        ch.origin = change.origin;
        return ch;
      };

      return P2POrgData;

    })(OrgData);
    Peer = (function() {
      function Peer() {
        this.changeCount = 0;
        this.connectionNumber = 0;
        this.data = new P2POrgData(this);
        this.data.on('change', (function(_this) {
          return function(change) {
            return _this.changed(change);
          };
        })(this));
      }

      Peer.prototype.receiveMessage = function(connection, msg) {
        if (msg.type in this.messageHandler) {
          console.log("receiving", msg);
          return this.messageHandler[msg.type](connection, msg);
        } else {
          return connection.error("Unknown message type: " + msg.type);
        }
      };

      Peer.prototype.changed = function(change) {};

      Peer.prototype.becomeMaster = function() {
        if (!this.mode) {
          this.mode = 'master';
          this.connections = {};
          this.pending = {};
          this.messageHandler = {
            change: (function(_this) {
              return function(connection, arg) {
                var change;
                change = arg.change;
                change.origin = connection.id;
                return preserveSelection(function() {
                  return _this.data.change(change);
                });
              };
            })(this),
            ack: function(connection, arg) {
              var count;
              count = arg.count;
              return connection.ack(count);
            }
          };
          this.changed = function(change) {
            var ch, con, id, ref, results;
            this.changeCount++;
            ch = {
              first: change.first,
              sets: change.sets,
              removes: change.removes,
              origin: change.origin
            };
            ref = this.connections;
            results = [];
            for (id in ref) {
              con = ref[id];
              results.push(con.pushChange(ch));
            }
            return results;
          };
          this.removeConnection = function(con) {
            delete this.connections[con.id];
            delete this.pending[con.id];
            return this.updateConnections();
          };
          this.addConnection = function(con) {
            this.connections[con.id] = con;
            delete this.pending[con.id];
            return this.updateConnections();
          };
          this.updateConnections = function() {
            var con, id, ref, results, tot;
            tot = _.size(this.connections);
            ref = this.connections;
            results = [];
            for (id in ref) {
              con = ref[id];
              results.push(con.updateConnections(tot));
            }
            return results;
          };
          return true;
        } else {
          return false;
        }
      };

      Peer.prototype.createConnectionForSlave = function(arg) {
        var connected, error, id, offerReady;
        offerReady = arg.offerReady, connected = arg.connected, error = arg.error;
        id = "master-" + (this.connectionNumber++);
        return this.pending[id] = new MC(this, id, offerReady, connected, error);
      };

      Peer.prototype.becomeSlave = function(updateConnections) {
        if (!this.mode) {
          this.mode = 'slave';
          this.changing = false;
          this.messageHandler = {
            document: (function(_this) {
              return function(connection, arg) {
                var block, blocks, document, i, len;
                _this.id = arg.id, document = arg.document;
                blocks = {};
                for (i = 0, len = document.length; i < len; i++) {
                  block = document[i];
                  blocks[block._id] = block;
                }
                return _this.data.load(document[0]._id, blocks);
              };
            })(this),
            change: (function(_this) {
              return function(connection, arg) {
                var change, count;
                count = arg.count, change = arg.change;
                _this.remoteChangeCount = count;
                _this.protectChange(function() {
                  return preserveSelection(function() {
                    return _this.data.change(change);
                  });
                });
                return connection.sendMessage('ack', {
                  count: count
                });
              };
            })(this),
            changeAck: (function(_this) {
              return function(connection, arg) {
                var count;
                count = arg.count;
                _this.remoteChangeCount = count;
                return connection.sendMessage('ack', {
                  count: count
                });
              };
            })(this),
            connections: function(connection, info) {
              return updateConnections(info);
            }
          };
          this.protectChange = function(func) {
            var oldChanging;
            oldChanging = this.changing;
            this.changing = true;
            try {
              return func();
            } finally {
              this.changing = oldChanging;
            }
          };
          this.changed = function(change) {
            var ch;
            if (!this.changing) {
              this.changeCount++;
              ch = {
                first: change.first,
                sets: change.sets,
                removes: change.removes,
                origin: change.origin
              };
              return this.connection.pushChange(ch);
            }
          };
          this.removeConnection = function(con) {
            return this.connection = null;
          };
          return true;
        } else {
          return false;
        }
      };

      Peer.prototype.createConnectionToMaster = function(arg) {
        var answerReady, connected, error, offer;
        offer = arg.offer, answerReady = arg.answerReady, connected = arg.connected, error = arg.error;
        return this.connection = new SC(this, offer, answerReady, connected, error);
      };

      return Peer;

    })();
    getFirst = function(blocks) {
      return blocks.get('FIRST');
    };
    setFirst = function(blocks, firstId) {
      return blocks.set('FIRST', firstId);
    };
    Connection = (function() {
      function Connection(peer1, errorFunc1) {
        this.peer = peer1;
        this.errorFunc = errorFunc1;
      }

      Connection.prototype.sendMessage = function(type, msg) {
        msg.type = type;
        console.log("SENDING", msg);
        return this.connection.sendMessage(JSON.stringify(JSON.decycle(msg)));
      };

      Connection.prototype.error = function(err) {
        console.log("Error: " + err.message, err);
        this.peer.removeConnection(this);
        return this.errorFunc(this, err);
      };

      return Connection;

    })();
    MC = (function(superClass) {
      extend(MC, superClass);

      function MC(peer, id1, offerReadyFunc, connectedFunc, errorFunc) {
        this.id = id1;
        MC.__super__.constructor.call(this, peer, errorFunc);
        this.trees = {};
        this.minCount = -1;
        this.lastUpdate = peer.currentUpdate;
        this.connection = new MasterConnection({
          offerReady: (function(_this) {
            return function(offer) {
              return offerReadyFunc(offer, _this);
            };
          })(this),
          connected: (function(_this) {
            return function() {
              peer.addConnection(_this);
              console.log("connected");
              _this.sendMessage('document', {
                id: _this.id,
                document: _this.document()
              });
              return typeof connectedFunc === "function" ? connectedFunc() : void 0;
            };
          })(this),
          handleMessage: (function(_this) {
            return function(msg) {
              return _this.peer.receiveMessage(_this, JSON.retrocycle(JSON.parse(msg)));
            };
          })(this)
        });
        this.connection.start((function(_this) {
          return function(err) {
            return _this.error(err);
          };
        })(this));
      }

      MC.prototype.ack = function(count) {
        var c, i, ref, ref1;
        if (this.minCount >= 0) {
          for (c = i = ref = this.minCount, ref1 = count; ref <= ref1 ? i <= ref1 : i >= ref1; c = ref <= ref1 ? ++i : --i) {
            delete this.trees[c];
          }
          if (this.maxCount === count) {
            return this.minCount = -1;
          }
        }
      };

      MC.prototype.document = function() {
        var block, cur, doc;
        doc = [];
        cur = this.peer.data.getFirst();
        while (cur) {
          block = this.peer.data.getBlock(cur);
          doc.push(block);
          cur = block.next;
        }
        return doc;
      };

      MC.prototype.establishConnection = function(answer) {
        return this.connection.establishConnection(answer);
      };

      MC.prototype.pushChange = function(change) {
        this.trees[this.peer.changeCount] = this.peer.data.blocks;
        this.maxCount = this.peer.changeCount;
        if (this.minCount < 0) {
          this.minCount = this.peer.changeCount;
        }
        if (change.origin !== this.id) {
          return this.sendMessage('change', {
            count: this.peer.changeCount,
            change: change
          });
        } else {
          return this.sendMessage('changeAck', {
            count: this.peer.changeCount
          });
        }
      };

      MC.prototype.updateConnections = function(tot) {
        return this.sendMessage('connections', {
          total: tot
        });
      };

      return MC;

    })(Connection);
    SC = (function(superClass) {
      extend(SC, superClass);

      function SC(peer, masterOffer, answerReadyFunc, connectedFunc, errorFunc) {
        SC.__super__.constructor.call(this, peer, errorFunc);
        this.connection = new SlaveConnection({
          offerReady: function(offer) {
            return answerReadyFunc(offer);
          },
          connected: function() {
            console.log("Connected");
            return typeof connectedFunc === "function" ? connectedFunc() : void 0;
          },
          handleMessage: (function(_this) {
            return function(msg) {
              return _this.peer.receiveMessage(_this, JSON.retrocycle(JSON.parse(msg)));
            };
          })(this)
        });
        this.connection.start(masterOffer, (function(_this) {
          return function(err) {
            return _this.error(err);
          };
        })(this));
      }

      SC.prototype.pushChange = function(change) {
        return this.sendMessage('change', {
          change: change
        });
      };

      return SC;

    })(Connection);
    return {
      Peer: Peer
    };
  });

}).call(this);

//# sourceMappingURL=p2p.js.map
