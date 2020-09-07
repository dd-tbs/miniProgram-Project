
import { request } from "../../request/index.js";
import regeneratorRuntime from '../../lib/runtime/runtime';
import { login } from "../../utils/asyncWx.js"

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
    // 获取用户信息
   async handleGetUserInfo(e){
      try {
        // console.log(e)
        // 获取用户信息
        const {rawData,signature,encryptedData,iv}=e.detail
        // 获取小程序登录成功后的code值
        const {code}=await login()
        const loginParams={rawData,signature,encryptedData,iv,code}
        //发送请求 获取用户的token值
        //const {token}=await request({url:"/users/wxlogin",data:loginParams,method:"POST"})
        
        const token=`Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo`
      //  把token存储中缓存中 同时跳转回上一个页面
        wx.setStorageSync('token', token)
        wx.navigateBack({
          delta: 1 // 回退前 delta(默认为1) 页面
          
        })
      } catch (error) {
        console.log(error)
      }
    
    }
})