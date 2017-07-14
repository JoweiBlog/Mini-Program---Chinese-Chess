/**
 *  PRECISION
 * */
const PRECISION = 0.01;

/**
 * deepClone
 * */
var deepClone = (obj, nbj) => {
  var nbj = nbj || {};
  for (var i in obj) {
    if (typeof obj[i] === 'object') {
      nbj[i] = obj[i].constructor === Array ? [] : {};
      deepClone(obj[i], nbj[i]);
    } else {
      nbj[i] = obj[i];
    }
  }
  return nbj;
};


/**
 * QZS data list;
 * */
const QZS = [
  { name: '車', type: 1, side: -1, x: -4, y: -4.5, isChoose: false, isDead: false },
  { name: '馬', type: 2, side: -1, x: -3, y: -4.5, isChoose: false, isDead: false },
  { name: '象', type: 3, side: -1, x: -2, y: -4.5, isChoose: false, isDead: false },
  { name: '士', type: 4, side: -1, x: -1, y: -4.5, isChoose: false, isDead: false },
  { name: '將', type: 5, side: -1, x: 0, y: -4.5, isChoose: false, isDead: false },
  { name: '士', type: 4, side: -1, x: 1, y: -4.5, isChoose: false, isDead: false },
  { name: '象', type: 3, side: -1, x: 2, y: -4.5, isChoose: false, isDead: false },
  { name: '馬', type: 2, side: -1, x: 3, y: -4.5, isChoose: false, isDead: false },
  { name: '車', type: 1, side: -1, x: 4, y: -4.5, isChoose: false, isDead: false },
  { name: '炮', type: 6, side: -1, x: -3, y: -2.5, isChoose: false, isDead: false },
  { name: '炮', type: 6, side: -1, x: 3, y: -2.5, isChoose: false, isDead: false },
  { name: '卒', type: 7, side: -1, x: -4, y: -1.5, isChoose: false, isDead: false },
  { name: '卒', type: 7, side: -1, x: -2, y: -1.5, isChoose: false, isDead: false },
  { name: '卒', type: 7, side: -1, x: 0, y: -1.5, isChoose: false, isDead: false },
  { name: '卒', type: 7, side: -1, x: 2, y: -1.5, isChoose: false, isDead: false },
  { name: '卒', type: 7, side: -1, x: 4, y: -1.5, isChoose: false, isDead: false },

  { name: '車', type: 1, side: 1, x: -4, y: 4.5, isChoose: false, isDead: false },
  { name: '馬', type: 2, side: 1, x: -3, y: 4.5, isChoose: false, isDead: false },
  { name: '相', type: 3, side: 1, x: -2, y: 4.5, isChoose: false, isDead: false },
  { name: '仕', type: 4, side: 1, x: -1, y: 4.5, isChoose: false, isDead: false },
  { name: '帥', type: 5, side: 1, x: 0, y: 4.5, isChoose: false, isDead: false },
  { name: '仕', type: 4, side: 1, x: 1, y: 4.5, isChoose: false, isDead: false },
  { name: '相', type: 3, side: 1, x: 2, y: 4.5, isChoose: false, isDead: false },
  { name: '馬', type: 2, side: 1, x: 3, y: 4.5, isChoose: false, isDead: false },
  { name: '車', type: 1, side: 1, x: 4, y: 4.5, isChoose: false, isDead: false },
  { name: '炮', type: 6, side: 1, x: -3, y: 2.5, isChoose: false, isDead: false },
  { name: '炮', type: 6, side: 1, x: 3, y: 2.5, isChoose: false, isDead: false },
  { name: '兵', type: 7, side: 1, x: -4, y: 1.5, isChoose: false, isDead: false },
  { name: '兵', type: 7, side: 1, x: -2, y: 1.5, isChoose: false, isDead: false },
  { name: '兵', type: 7, side: 1, x: 0, y: 1.5, isChoose: false, isDead: false },
  { name: '兵', type: 7, side: 1, x: 2, y: 1.5, isChoose: false, isDead: false },
  { name: '兵', type: 7, side: 1, x: 4, y: 1.5, isChoose: false, isDead: false }
];

/**
 * util
 * */
const util = {};

Object.assign(util, {
  /**
   * float add / sub / mul / div
   */
  FAdd(a, b) {
    let c, d, e;
    try{ c = a.toString().split('.')[1].length; }catch(f) { c =0; }
    try{ d = b.toString().split('.')[1].length; }catch(f) { d =0; }
    return e =Math.pow(10,Math.max(c, d)), (FMul(a, e) + FMul(b, e)) / e;
  },

  FSub(a, b) {
    let c, d, e;
    try{ c = a.toString().split('.')[1].length; }catch(f) { c =0; }
    try{ d = b.toString().split('.')[1].length; }catch(f) { d =0; }
    return e =Math.pow(10,Math.max(c, d)), (FMul(a, e) - FMul(b, e)) / e;
  },

  FMul(a, b) {
    let c =0, d = a.toString(), e = b.toString();
    try{ c += d.split('.')[1].length; }catch(f) {}
    try{ c += e.split('.')[1].length; }catch(f) {}
    return Number(d.replace('.', '')) * Number(e.replace('.', '')) / Math.pow(10, c);
  },

  FDiv(a, b) {
    let c, d, e =0, f =0;
    try{ e = a.toString().split('.')[1].length; }catch(g) {}
    try{ f = b.toString().split('.')[1].length; }catch(g) {}
    return c =Number(a.toString().replace('.', '')), d =Number(b.toString().replace('.', '')), FMul(c / d,Math.pow(10, f - e));
  }
});

/**
 * QP;
 * */
const QP = function (CTX, qpw, qpc) {
  const qp = {
    init() {
      const c = qpc;
      const ch = c / 2;

      CTX.setLineWidth(1);
      CTX.setStrokeStyle('#999999');

      // ROW;
      for (let i = 1; i < 9; i++) {
        me.drawLine(ch - (qpw / 2), (i - 4.5) * c, (qpw / 2) - ch, (i - 4.5) * c);
      }

      // COLUMN;
      for (let i = 1; i < 8; i++) {
        me.drawLine((i - 4) * c, -(4.5 * c), (i - 4) * c, -0.5 * c);
        me.drawLine((i - 4) * c, 0.5 * c, (i - 4) * c, (4.5 * c));
      }

      // SLASH；
      me.drawLine(-c, -4.5 * c, c, -2.5 * c);
      me.drawLine(-c, -2.5 * c, c, -4.5 * c);
      me.drawLine(-c, 2.5 * c, c, 4.5 * c);
      me.drawLine(-c, 4.5 * c, c, 2.5 * c);

      // POINT ANGLE
      me.drawPoint(-3 * c, -2.5 * c);
      me.drawPoint(3 * c, -2.5 * c);
      me.drawPoint(-3 * c, 2.5 * c);
      me.drawPoint(3 * c, 2.5 * c);

      me.drawPoint(-4 * c, -1.5 * c, 2);
      me.drawPoint(-2 * c, -1.5 * c);
      me.drawPoint(0, -1.5 * c);
      me.drawPoint(2 * c, -1.5 * c);
      me.drawPoint(4 * c, -1.5 * c, 1);

      me.drawPoint(-4 * c, 1.5 * c, 2);
      me.drawPoint(-2 * c, 1.5 * c);
      me.drawPoint(0, 1.5 * c);
      me.drawPoint(2 * c, 1.5 * c);
      me.drawPoint(4 * c, 1.5 * c, 1);

      CTX.stroke();

      // BORDER；
      CTX.setLineWidth(1);
      CTX.setStrokeStyle('#999999');
      CTX.strokeRect(-(4 * c), -(4.5 * c), 8 * c, 9 * c);

      // CHINESE;
      CTX.setFontSize(qpc / 2.5);
      CTX.setFillStyle('#999999');
      CTX.setTextAlign('center');
      CTX.save();
      CTX.rotate(Math.PI / 2);
      CTX.fillText('楚', 0, -(c * 3 - ch / 2));
      CTX.fillText('河', 0, -(c * 2 - ch / 2));
      CTX.restore();
      CTX.save();
      CTX.rotate(Math.PI / -2);
      CTX.fillText('汉', 0, -(c * 3 - ch / 2));
      CTX.fillText('界', 0, -(c * 2 - ch / 2));
      CTX.restore();
    },
    drawLine(x, y, m, n) {
      CTX.moveTo(x, y);
      CTX.lineTo(m, n);
    },
    drawPoint(x, y, t) {
      // t: 0： all； 1：left； 2：right；
      if (t !== 2) {
        me.drawLine(x - 4, y - 4, x - 4, y - 10);
        me.drawLine(x - 4, y - 4, x - 10, y - 4);
        me.drawLine(x - 4, y + 4, x - 4, y + 10);
        me.drawLine(x - 4, y + 4, x - 10, y + 4);
      }

      if (t !== 1) {
        me.drawLine(x + 4, y - 4, x + 4, y - 10);
        me.drawLine(x + 4, y - 4, x + 10, y - 4);
        me.drawLine(x + 4, y + 4, x + 4, y + 10);
        me.drawLine(x + 4, y + 4, x + 10, y + 4);
      }
    },
  };
  const me = qp;
  return me;
};

/**
 * QZ;
 * */
const QZ = function (CTX, qpc) {
  const qz = {
    qzs: [],
    init(role) {
      me.reDraw(role, QZS);
    },
    paintQz(o) {
      if (o.isDead) return;
      CTX.beginPath();
      CTX.arc(o.x * qpc, o.y * qpc, qpc / 2.3, 0, 2 * Math.PI);
      CTX.setShadow(0, 0, 1, '#888888');
      CTX.setFillStyle('#ffffff');
      CTX.fill();
      CTX.setFontSize(qpc / 2.2);
      CTX.setTextAlign('center');
      CTX.setShadow(0, 0, 1, '#ffffff');
      CTX.setFillStyle(o.side === 1 ? '#d41d1d' : '#403B4A');
      CTX.fillText(o.name, o.x * qpc, o.y * qpc + qpc / 6);
      CTX.closePath();

      if (o.isChoose) {
        CTX.beginPath();
        CTX.setLineWidth(1);
        CTX.setStrokeStyle('#d41d1d');
        CTX.arc(o.x * qpc, o.y * qpc, qpc / 2.4, 0, 2 * Math.PI);
        CTX.stroke();
        CTX.closePath();
      }
    },
    choose(o) {
      o.isChoose = true;
    },
    checkPos(x, y) {
      const qzs = [...me.qzs];
      let so = null;
      for (let i in qzs) {
        if (qzs[i].isDead) { continue; }
        if (Math.abs(qzs[i].x - x) < PRECISION
          && Math.abs(qzs[i].y - y) < PRECISION) {
          so = qzs[i];
          break;
        }
      }
      return so;
    },
    checkChoose(role) {
      const qzs = [...me.qzs];
      const tr = role;
      let co = null;
      for (let i in qzs) {
        if (tr === qzs[i].side && qzs[i].isChoose) {
          co = qzs[i];
          break;
        }
      }
      return co;
    },
    cancelChoose(o) {
      o.isChoose = false;
    },
    canMove(o, x, y) {
      let f = false;
      const [t, tx, ty, c] = [o.type, o.x, o.y, 1];

      // check move;

      // '車 / 车'
      if (t === 1) {
        if (tx === x) {
          if (Math.abs(Math.abs(y - ty) - c) < PRECISION) return true;
          if (y < ty) {
            for (let i = ty - c; i > y; i -= c ) {
              if (me.checkPos(x, i)) {
                break;
              } else {
                f = true;
              }
            }
          } else {
            for (let i = ty + c; i < y; i += c) {
              if (me.checkPos(x, i)) {
                break;
              } else {
                f = true;
              }
            }
          }

        } else if (ty === y) {
          if (Math.abs(Math.abs(x - tx) - c) < PRECISION) return true;
          if (x < tx) {
            for (let i = tx - c; i > x; i -= c ) {
              if (me.checkPos(i, y)) {
                break;
              } else {
                f = true;
              }
            }
          } else {
            for (let i = tx + c; i < x; i += c) {
              if (me.checkPos(i, y)) {
                break;
              } else {
                f = true;
              }
            }
          }

        }
      }

      // '馬 / 马'
      else if (t === 2) {
        if (Math.abs(Math.abs(x - tx) - c) < PRECISION
          && Math.abs(Math.abs(y - ty) - 2 * c) < PRECISION) {
          if ((y < ty && !me.checkPos(tx, ty - c)) || (y > ty && !me.checkPos(tx, ty + c))) {
            f = true;
          }
        } else if (Math.abs(Math.abs(x - tx) - 2 * c) < PRECISION
          && Math.abs(Math.abs(y - ty) - c) < PRECISION) {
          if ((x < tx && !me.checkPos(tx - c, ty)) || (x > tx && !me.checkPos(tx + c, ty))) {
            f = true;
          }
        }
      }

      // '相 / 象'
      else if (t === 3) {
        if (((ty > 0 && y > 0) || (ty < 0 && y < 0))
          && Math.abs(Math.abs(x - tx) - 2 * c) < PRECISION
          && Math.abs(Math.abs(y - ty) - 2 * c) < PRECISION
          && !me.checkPos((x + tx) / 2, (y + ty) / 2)
        ) {
          f = true;
        }
      }

      // '仕 / 士'
      else if (t === 4) {
        if (Math.abs(Math.abs(x - tx) - c) < PRECISION
          && Math.abs(Math.abs(y - ty) - c) < PRECISION
          && Math.abs(x) <= c
          && Math.abs(y) >= 2.5 * c
        ) {
          f = true;
        }
      }

      // '帥 / 将'
      else if (t === 5) {
        if (((tx === x && Math.abs(Math.abs(y - ty) - c) < PRECISION)
          || (ty === y && Math.abs(Math.abs(x - tx) - c) < PRECISION))
          && Math.abs(x) <= c
          && Math.abs(y) >= 2.5 * c
        ) {
          f = true;
        }
      }

      // '炮'
      else if (t === 6) {
        let cpi = [];
        let cps = (tx === x) ? y : (ty === y ? x : 'ERROR') ;
        if (tx === x) {
          if (y < ty) {
            for (let i = ty - c; (i > y || (Math.abs(i - y) < PRECISION)); i -= c ) {
              me.checkPos(x, i) && cpi.push(i);
            }
          } else {
            for (let i = ty + c; (i < y || (Math.abs(i - y) < PRECISION)); i += c) {
              me.checkPos(x, i) && cpi.push(i);
            }
          }

        } else if (ty === y) {
          if (x < tx) {
            for (let i = tx - c; (i > x || (Math.abs(i - x) < PRECISION)); i -= c ) {
              me.checkPos(i, y) && cpi.push(i);
            }
          } else {
            for (let i = tx + c; (i < x || (Math.abs(i - x) < PRECISION)); i += c) {
              me.checkPos(i, y) && cpi.push(i);
            }
          }

        }

        if (cps !== 'ERROR'
          && (cpi.length === 0 || (cpi.length === 2 && (Math.abs(cpi[1] - cps) < PRECISION)))) {
          f = true;
        }

        cpi = null;
        cps = null;
      }

      // '卒 / 兵'
      else if (t === 7) {

        if (ty > 0 && Math.abs(x - tx) < PRECISION && ty > y && Math.abs(Math.abs(y - ty) - c) < PRECISION ) {
          f = true;
        } else if (ty < 0
          && (Math.abs(y - ty) < PRECISION || y < ty)
          && (Math.abs(x - tx) < PRECISION && Math.abs(Math.abs(y - ty) - c) < PRECISION
          || (Math.abs(y - ty) < PRECISION && Math.abs(Math.abs(x - tx) - c) < PRECISION))
        ) {
          f = true;
        }
      }

      return f;
    },
    go(o, x, y, so, cb) {
      if (!me.canMove(o, x, y)) return;
      let si = -2;
      o.x = x;
      o.y = y;
      me.cancelChoose(o);

      if (so) {
        so.isDead = true;
        if (so.type === 5) {
          si = so.side;
        }
      }
      cb && cb(me.qzs, si);
    },
    reDraw(role, qzs) {
      const q = deepClone(qzs, []);
      // exchange qzs;
      if ((role * 1) === -1) {
        for(let i = 0, l = q.length; i < l; i++) {
          q[i].x = -1 * q[i].x;
          q[i].y = -1 * q[i].y;
        }
      }
      me.qzs = [...q];
      me.repaint();
    },
    repaint() {
      for(let i in me.qzs) {
        me.paintQz(me.qzs[i]);
      }
    },
  };
  const me = qz;
  return me;
};


module.exports = { util, QP, QZ, QZS };