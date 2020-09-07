// pages/login/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  handleGetUserInfo(e){
    // console.log(e)
    const {userInfo}=e.detail
    //把获取到的用户信息存入缓存
    wx.setStorageSync("userinfo", userInfo);
    //返回上一页
    wx.navigateBack({
      delta: 1// 回退前 delta(默认为1) 页面

    })
  }
})