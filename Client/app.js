//app.js
App({
  onLaunch: function () {

    // check session
    wx.checkSession({
      success() { return; },
      fail() {
        wx.login({
          success(res) {
            if (res.code) {
              // 发起网络请求
              // 不做校验
            } else {
              console.log('获取用户登录态失败！' + res.errMsg)
            }
          }
        })
      },
    })
  },
})