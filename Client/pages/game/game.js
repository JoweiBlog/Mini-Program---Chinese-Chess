
//game.js
import Socket from '../../utils/socket';
const { QP, QZ } = require('../../utils/util.js');
Page({
  data: {
    CTX: null,
    TQP: null,
    TQZ: null,
    OPS: {
      qpw: 0,
      qph: 0,
      qpc: 0,
    },
    STATUS: {
      turnRole: 1,  // turn role: 1 || -1;
      /**
       * gm status:
       * 1  : playing;
       * 2  : start;
       * -1 : not start;
       * -2 : end;
       * */
      gameStatus: -1,
    },
    SOCKET: null,
    rid: 0,
    player: {
      role: 1, // red: 1; black: -1;
      avatar: '../../sources/images/avatar.png',
    },
    players: [],
    /**
     * msg type
     * */
    msgType: {
      room: {
        join: 100,
        notPresent: 101,
        full: 102,
        quit: 103,
      },
      game: {
        step: 1000,
      }
    },
    /**
     * emit receiver type
     * */
    receiverType: {
      me: 1,
      other: 2,
      room: 3,
      sys: 4,
    },
  },
  onUnload() {
    this.closeSo('正在退出');
  },
  onLoad(opt) {
    const self = this;
    try {
      if (!opt.rid) return wx.redirectTo({ url: '../../index/index' });

      const { windowWidth } = wx.getSystemInfoSync();
      self.setData({
        'rid': opt.rid,
        
        // get client;
        'CTX': wx.createCanvasContext('qp'),
        'OPS.qpw': windowWidth - 30,
        'OPS.qpc': (windowWidth - 30) / 9,
        'OPS.qph': (windowWidth - 30) / 9 * 10,
      });

      wx.getUserInfo({
        success(res) {
          const rui = res.userInfo;
          self.setData({
            'player': Object.assign(self.data.player, { id: rui.nickName, name: rui.nickName, avatar: rui.avatarUrl }),
          });
        },
        complete() {
          self.initSocket(self.data.rid);
        }
      });
    } catch (e) {}
  },
  initBox() {
    const self = this;
    const { qpw, qph, qpc } = self.data.OPS;

    // center point;
    self.data.CTX.translate(qpw / 2, qph / 2);

    // clear
    self.clearBox();

    // init qp;
    self.setData({ 'TQP': new QP(self.data.CTX, qpw, qpc) });
    self.data.TQP.init();

    // init qz for the role;
    self.setData({ 'TQZ': new QZ(self.data.CTX, qpc) });
    self.data.TQZ.init(self.data.player.role);

    self.data.CTX.draw();
  },
  initSocket() {
    const self = this;
    const { msgType, receiverType, rid } = self.data;
    self.setData({
      'SOCKET': new Socket('wss://xq.joweiblog.top', rid)
    });

    self.data.SOCKET.onOpen(function () {
      // success connect & send player to server;
      self.data.SOCKET.sendMsg({
        type: msgType.room.join,
        player: self.data.player
      });
    });
   
    // receive msg && process msg by type;
    self.data.SOCKET.onMsg((d) => {
      // game
      if (d.type === msgType.room.join) {
        if (d.receiverType === receiverType.me) {
          self.setData({ 'player.role': d.player.role });
        } else if (d.receiverType === receiverType.room) {
          self.setData({ 'players': [...d.players] });
          self.data.players.length >= 2
          && self.data.player.role === 1
          && self.startGame()
          && wx.showToast({
            title: '开始',
            icon: 'loading',
            duration: 1000
          });
        }
      } else if (d.type === msgType.room.notPresent) {
        self.closeSo('当前房间已不存在或已解散');
      } else if (d.type === msgType.room.full) {
        self.closeSo('当前房间正在游戏中');
      } else if (d.type === msgType.room.quit) {
        const pdr = d.player.role === 1 ? '红方' : '黑方';
        d.player.role !== 1 && self.setData({ 'players': [...d.players] });
        self.closeSo(`${pdr}退出`, d.player.role !== 1);
        self.initBox(); // reset;
      }

      // game
      if (d.type === msgType.game.step) {
        self.setData({
          'STATUS.gameStatus': d.gameStatus,
          'STATUS.turnRole': d.turnRole,
        });

        if (d.step && d.step.length > 0) {
          self.data.TQZ.reDraw(self.data.player.role, d.step);
          self.repaint();
        }

        // start
        if (self.data.STATUS.gameStatus === 2) {
          wx.showToast({
            title: '开始',
            icon: 'loading',
            duration: 1000
          });
          self.initBox();
        }

        // end;
        if (self.data.STATUS.gameStatus === -2) {
          const spr = self.data.player.role;
          wx.showToast({
            title: (spr !== 1 ? '红方' : '黑方') + '赢，' + (spr === 1 ? '红方' : '黑方') + '输' ,
            icon: 'success',
            duration: 5000
          });
        }
      }
    });

    self.data.SOCKET.onClose(() => {
      wx.showToast({
        title: '退出',
        icon: 'loading',
        duration: 500
      });
      setTimeout(() => {
        if (getCurrentPages().length !== 1
        || (getCurrentPages().length === 1 && getCurrentPages()[0].route !== 'pages/index/index' )) {
          wx.reLaunch({ url: '../index/index' });
        }
      }, 1000);
    });
  },
  startGame() {
    const self = this;
    const { players, player, msgType } = self.data;
    if (Math.abs(player.role) !== 1) return;
    if (players.length < 2) {
      return wx.showToast({
        title: '对手还没来哦~',
        icon: 'loading',
        duration: 1000
      });
    }

    self.initBox();
    self.setData({
      'STATUS.gameStatus': 2,
      'STATUS.turnRole': 1,
    });
    self.data.SOCKET.sendMsg({
      type: msgType.game.step,
      playRole: player.role,
      turnRole: self.data.STATUS.turnRole,
      gameStatus: self.data.STATUS.gameStatus,
    });
  },
  boxTap(e) {
    const me = this;
    const { TQZ, OPS, STATUS, player, msgType } = me.data;
    const { qpw, qph, qpc } = OPS;

    if ((STATUS.gameStatus !== 1 && STATUS.gameStatus !== 2) || player.role !== STATUS.turnRole) return;
    me.setData({ 'STATUS.gameStatus': 1 });

    console.log('tap');
    const { x, y } = e.touches[0];
    const [ox, oy] = [x - qpw / 2, y - qph / 2];
    const oxb = Math.abs(ox % qpc / qpc);
    const sx = (ox > 0
        ? (oxb <= .5 ? Math.floor(ox / qpc) : Math.ceil(ox / qpc))
        : (oxb <= .5 ? Math.ceil(ox / qpc) : Math.floor(ox / qpc)));
    const sy = (Math.floor(oy / qpc) + .5);

    // check qz obj; if it equals null , it means that has no one of qzs;
    const so = TQZ.checkPos(sx, sy);
    const co = TQZ.checkChoose(STATUS.turnRole);

    if (!so && co) {
      // move;
      TQZ.go(co, sx, sy, null, (qzl) => {
        me.setData({
          'STATUS.turnRole': me.data.STATUS.turnRole === 1 ? -1 : 1,
        });
        me.data.SOCKET.sendMsg({
          type: msgType.game.step,
          playRole: player.role,
          turnRole: me.data.STATUS.turnRole,
          gameStatus: me.data.STATUS.gameStatus,
          step: [...qzl]
        });
      });
    } else if (so && co) {
      if (so.side === co.side) {
        // reset choose;
        TQZ.cancelChoose(co);
        TQZ.choose(so);
      } else {
        // goDead;
        TQZ.go(co, sx, sy, so, (qzl, lostSide) => {

          if (Math.abs(lostSide) === 1) {
            me.setData({
              'STATUS.gameStatus': -2,
            });
            wx.showToast({
              title: (lostSide !== 1 ? '红方' : '黑方') + '赢，' + (lostSide === 1 ? '红方' : '黑方') + '输' ,
              icon: 'success',
              duration: 5000
            });
          }

          me.setData({
            'STATUS.turnRole': me.data.STATUS.turnRole === 1 ? -1 : 1,
          });
          me.data.SOCKET.sendMsg({
            type: msgType.game.step,
            playRole: player.role,
            turnRole: me.data.STATUS.turnRole,
            gameStatus: me.data.STATUS.gameStatus,
            step: [...qzl]
          });
        });
      }
    } else if (so && !co && so.side === STATUS.turnRole){
      TQZ.choose(so);
    }

    me.repaint();
  },
  clearBox() {
    const { qpw, qph } = this.data.OPS;
    this.data.CTX.clearRect(-(qpw / 2), -(qph / 2), qpw * 1.3, qpw * 1.3);
  },
  repaint() {
    const me = this;
    me.clearBox();
    me.data.CTX.translate(me.data.OPS.qpw / 2, me.data.OPS.qph / 2);
    me.data.TQP.init();
    me.data.TQZ.repaint();
    me.data.CTX.draw();
  },
  closeSo(msg, notClose = false) {
    const self = this;
    wx.showToast({
      title: msg || '未知错误',
      icon: 'loading',
      duration: 1000
    });
    if (!notClose) {
      setTimeout(() => {
        self.data.SOCKET.close();
      }, 1000);
    }
  },
  onShareAppMessage(ops) {
    if (ops.from === 'button') {
      console.log(ops.target)
    }

    return {
      title: '邀请你玩一盘象棋,在线等..',
      success: function () {
        wx.showToast({
          title: '邀请已发出',
        });
      },
      fail: function () {
        wx.showToast({
          title: '邀请发送失败',
        })
      },
    }
  },
});
