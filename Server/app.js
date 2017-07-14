/**
 * Created by Jowei on 2017/6/10.
 */

(function () {
  'use strict';

  var cfg = {
    port: 3030,
  };

  var fs = require('fs');
  var http = require('http');
  var ws = require('ws');
  var url = require('url');
  var server = http.createServer(function(req, res) {
    res.writeHead(200);
    res.end('websocket');
  });
  var wss = new ws.Server({ server: server });


  /**
   * socket
   *
   * rooms = {
   *    'room_1': [{id: 232, name: 'jowei', role: 1}, {id: 655, name: 'linkva', role: -1}]
   * }
   *
   * red player : role 1;
   * black player : role -1;
   * */
  var rooms = {};

  /**
   * msg type
   * */
  var msgType = {
    room: {
      join: 100,
      notPresent: 101,
      full: 102,
      quit: 103,
    },
    game: {
      step: 1000,
    }
  };

  /**
   * emit receiver type
   * */
  var receiverType = {
    me: 1,
    other: 2,
    room: 3,
    sys: 4,
  };


  /**
   * Broadcast to all;
   * */
  wss.broadcastSys = function broadcast(data) {
    wss.clients.forEach(function each(client) {
      if (client.readyState == ws.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };

  /**
   * Broadcast to room;
   * */
  wss.broadcastRoom = function broadcast(data, rid) {
    wss.clients.forEach(function each(client) {
      if (client.readyState == ws.OPEN && rid == client.rid) {
        client.send(JSON.stringify(data));
      }
    });
  };

  /**
   * Broadcast to room else;
   * */
  wss.broadcastElse = function broadcastElse(data, rid, pid) {
    wss.clients.forEach(function each(client) {
      if (client.readyState == ws.OPEN && rid == client.rid && pid != client.player.id) {
        client.send(JSON.stringify(data));
      }
    });
  };
  
  /**
   * heartbeat
   * */
  function heartbeat() {
    this.isAlive = true;
  }

  
  wss.on('connection', function (wsc, req) {
    wsc.rid = url.parse(req.url, true).query.rid;
    if (!wsc.rid) return wsc.close();
    console.log('room ' + wsc.rid + ' : connected');
    wsc.isAlive = true;
    wsc.player = {};
    wsc.on('pong', heartbeat);

    wsc.on('message', function incoming(res) {
      var info = JSON.parse(res);

      if (info.type == msgType.room.join) {
        wsc.player = info.player;

        if (!rooms[wsc.rid]) {
          if (wsc.rid == info.player.id) {
            rooms[wsc.rid] = [];
            wsc.player.role = 1;
            rooms[wsc.rid].push(wsc.player);

            // emit red player join;
            console.log('room ' + wsc.rid + ' : ' + JSON.stringify(wsc.player) + ' joined');
            wsc.send(JSON.stringify({
              type: msgType.room.join,
              receiverType: receiverType.me,
              player: wsc.player
            }));
            wss.broadcastRoom({
              type: msgType.room.join,
              receiverType: receiverType.room,
              players: rooms[wsc.rid]
            }, wsc.rid);
          } else {
            // the room is not present;
            console.log('room ' + wsc.rid + ' : ' + ' not present.');
            wsc.send(JSON.stringify({
              type: msgType.room.notPresent,
            }));
          }
        } else {
          if (wsc.rid != info.player.id) {
            if (rooms[wsc.rid].length < 2) {
              wsc.player.role = -1;
              rooms[wsc.rid].push(wsc.player);

              // emit black player join;
              console.log('room ' + wsc.rid + ' : ' + JSON.stringify(wsc.player) + ' joined');
              wsc.send(JSON.stringify({
                type: msgType.room.join,
                receiverType: receiverType.me,
                player: wsc.player
              }));
              wss.broadcastRoom({
                type: msgType.room.join,
                receiverType: receiverType.room,
                players: rooms[wsc.rid]
              }, wsc.rid);
            } else {
              // the room is full;
              console.log('room ' + wsc.rid + ' : ' + ' full.');
              wsc.send(JSON.stringify({
                type: msgType.room.full,
              }));
            }
          }
        }
      }
      if (info.type == msgType.game.step) {
        if (info.step && (info.playRole * 1) === -1) {
          for(let i = 0, l = info.step.length; i < l; i++) {
            info.step[i].x = -1 * info.step[i].x;
            info.step[i].y = -1 * info.step[i].y;
          }
        }
        wss.broadcastElse(info, wsc.rid, wsc.player.id);
      }
    });

    // close;
    wsc.on('close', function () {
      console.log('room ' + wsc.rid + ' : ' + JSON.stringify(wsc.player) + ' quit');

      if (rooms[wsc.rid] && rooms[wsc.rid].length > 0) {
        for (var i = 0; i < rooms[wsc.rid].length; i++) {
          if (wsc.player.role === rooms[wsc.rid][i].role) {
            rooms[wsc.rid].splice(i, 1);
            break;
          }
        }

        console.log('room ' + wsc.rid + ' : ' + rooms[wsc.rid]);

        if (rooms[wsc.rid].length === 0) {
          delete rooms[wsc.rid];
          console.log('clear the room ' + wsc.rid + ' .');
        }
      }

      // quit / disconnect
      Math.abs(wsc.player.role) === 1 && wss.broadcastElse({
        type: msgType.room.quit,
        receiverType: receiverType.other,
        player: wsc.player,
        players: rooms[wsc.rid],
      }, wsc.rid,  wsc.player.id);
    });

    // error;
    wsc.on('error', function () {
      console.log('error');
    })
  });



  /**
   * interval
   * */
  var interval = setInterval(function interval() {
    wss.clients.forEach(function each(client) {
      if (client.isAlive === false) return client.terminate();
      client.isAlive = false;
      client.ping('', false, true);
    })
  }, 30000);


  /**
   * listen
   * */

  server.listen(cfg.port, function () {
    console.log('Listening on http://localhost:' + cfg.port);
  });
}());