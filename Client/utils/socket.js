/**
 * Created by Jowei on 2017/6/13.
 */

/**
 * socket
 * @param {String} host
 * @param {String} rid   // room id
 * */

class Socket {
  constructor(host, rid) {
    this.host = `${host}?rid=${rid}`;
    this.rid = rid;
    this.connected = false;

    this.connect();
    wx.onSocketError(() => {
      console.log('connect error');
      this.connected = false;
      this.connect();
    })
  }

  connect() {
    const me = this;
    wx.connectSocket({
      url: me.host,
    })
  }

  onOpen(cb) {
    const me = this;
    wx.onSocketOpen(() => {
      console.log('connected');
      me.connected = true;
      cb && cb();
    })
  }

  onClose(cb) {
    const me = this;
    wx.onSocketClose(() => {
      console.log('disconnect');
      me.connected = false;
      cb && cb();
    })
  }

  onMsg(cb) {
    wx.onSocketMessage((res) => {
      cb && cb(JSON.parse(res.data));
    })
  }

  sendMsg(obj) {
    if (!this.connected) return;
    wx.sendSocketMessage({
      data: JSON.stringify(obj)
    })
  }

  close() {
    wx.closeSocket();
  }
}


export default Socket;