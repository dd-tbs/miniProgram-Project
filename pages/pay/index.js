/**
 * 1 页面加载的时候
 *   1 从缓存中获取购物车数据渲染到页面中 这些数据的 checked=true
 *   
 * 2 微信支付
 *   1 哪些人 哪些账号可以实现微信支付
 *     1 企业账号
 *     2 企业账号的小程序后台中 必须给开发者添加白名单
 *       一个APPID可以同时绑定多个开发者
 *       这些开发者就可以共用这个appid 和 它的开发权限了
 * 
 * 3 支付按钮  没有企业账号做不了
 *   1 先判断缓存中有没有token
 *   2 没有的话 跳转到授权页面,进行获取token
 *   3 有token 就正常执行流程
 *   4 创建订单 获取订单编号
 *   5 完成微信支付
 *   6 手动删除缓存中 已经被选中的商品
 *   7 删除后的购物车数据填充回缓存
 *   8 在跳转页面
 * 
 * 
 */
import { request } from "../../request/index.js";
import { getSetting,chooseAddress,openSetting,showModal,showToast,requestPayment } from "../../utils/asyncWx.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

 /**
  * 页面的初始数据
  */
 data: {
   address:{},
   cart:[],
   totalPrice:0,
   totalNum:0
 },

 /**
  * 生命周期函数--监听页面加载
  */
 onLoad: function (options) {

 },

 onShow(){
   //获取缓存中的收货地址
   const address = wx.getStorageSync("address")
   // 1 获取缓存中购物车的数据
   let cart=wx.getStorageSync("cart") || [];
  //  过滤后的购物车数组
  cart = cart.filter(v=>v.checked)
   this.setData({address})
   let totalPrice=0
   let totalNum=0
   cart.forEach(v=>{

    totalPrice += v.num*v.goods_price
    totalNum += v.num

   })
   
   this.setData({
     cart,
     totalPrice,
     totalNum,
     address
   })

 },

//  点击支付
async handleOrderPay(){
 try {
    //判断缓存中有没有token
    // const token=wx.getStorageSync("token")
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 创建订单
    //准备请求头参数
    const header={Authorization:token}
    //请求体参数
    const order_price=this.totalPrice
    const consignee_addr = this.data.address.all; 
    const cart = this.data.cart; 
    let goods=[]
    cart.forEach(v=>goods.push({
      goods_id: v.goods_id,
      goods_number: v.num,
      goods_price: v.goods_price
    }))
    const orderParams={order_price, consignee_addr, goods}
    //准备发送请求 创建订单 获取订单编号
    // const {order_number}=await request({url:"/my/orders/create",method:"post",data:orderParams})

    // console.log(order_number)
    const order_number="HMDD20190802000000000422"
    let pay={
      "timeStamp": "1564730510",
      "nonceStr": "SReWbt3nEmpJo3tr",
      "package": "prepay_id=wx02152148991420a3b39a90811023326800",
      "signType": "MD5",
      "paySign": "3A6943C3B865FA2B2C825CDCB33C5304"
    }
    // 发起预支付接口
    //const {pay}=await request({ url: "/my/orders/chkOrder", method: "POST", data: {order_number} })

    //发起微信支付
    //await requestPayment(pay)
    const res={...pay}
    //查看订单支付状态
    //const res=await request({ url: "/my/orders/chkOrder", method: "POST", data: {order_number} })

    await showToast({title:"支付成功"})

    //手动删除缓存中已经支付了的商品
    let newCart=wx.getStorageSync("cart");
    newCart=newCart.filter(v=> !v.checked)

    //再填充回缓存
    wx.setStorageSync("cart", newCart);

    //支付成功后跳转到订单页面
    wx.navigateTo({
      url: '/pages/order/index'
    });
 } catch (error) {
  await showToast({title:"支付失败"})
   console.log(error)
 }
}

})