// index.js
Page({
  data: {},
  // Create room;
  createRoom() {
    wx.getUserInfo({
      success(res) {
        const rui = res.userInfo;
        wx.navigateTo({
          url: `../game/game?rid=${rui.nickName}`
        });
      },
    });
  },
  onLoad: function () {
    console.log('onLoad');
  },
});
