/*
  1 用户上画页面 滚动条触底 开始加载下一页数据
    1找到滚动条触底事件 
    2判断还有没有下一页数据
      1 获取当前数据的总页数
        总页数 = Math.ceil(总条数 / 页容量)
      2 获取到当前的页码  pagenum
      3 判断当前的页码 是否发育等于 总页数
        表示没有下一页数据
    3如果没有数据了弹出提示
    4如果有则 加载下一页
      1 用当前的页码++
      2 重新发送请求
      3 数据请求回来 要对data中的数组进行拼接 ,而不是全部替换


  2 下拉刷新页面
    1 触发下拉刷新事件 需要在页面的json文件中开启enablePullDownRefresh
      找到触发下拉刷新的事件
    2 重置数据 数组
    3 重置页码为1
    4 重新发送请求
    5 数据请求回来需要手动关闭页面的等待效果
*/



// pages/goods_list/index.js
import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs:[
      {
        id:0,
        value:"综合",
        isActive:true
      },
      {
        id:1,
        value:"销量",
        isActive:false
      },
      {
        id:2,
        value:"价格",
        isActive:false
      }
    ],
    goodsList:[]
  },

  

  //默认总页数为1
  totalPages:1,

  //接口要的参数
  QueryParams:{
    query:"",
    cid:"",
    pagenum:1,
    pagesize:10
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.QueryParams.cid = options.cid || ""
    this.QueryParams.query = options.query || ""
    this.getGoodsList()
  },

  //获取商品列表数据
  async getGoodsList(){
    const res=await request({url:"/goods/search",data:this.QueryParams})
    //获取数据总条数
    const total=res.total
    // 计算总页数
    this.totalPages=Math.ceil(total/this.QueryParams.pagesize)
    // console.log(this.totalPages)
    this.setData({
      //拼接数组
     goodsList:[...this.data.goodsList,...res.goods]
    })

    // 关闭页面等待效果 只有在触发下拉刷新时才会执行这个方法
    wx.stopPullDownRefresh()
  },


  //标题的点击事件,从子组件中传递过来的
  handleTabsItemChange(e){
    // console.log(e)
    //获取被点击的标题的索引
    const {index} = e.detail
    //修改原数组
    let {tabs} = this.data
    tabs.forEach((v,i) => i===index?v.isActive=true:v.isActive=false)
    //赋值到data中
    this.setData({
      tabs
    })
  },

  // 页面上滑 滚动条触底事件
  onReachBottom(){
    // console.log("页面触底")
    //判断有没有下一页
    if(this.QueryParams.pagenum>=this.totalPages){
      //没有下一页
      wx.showToast({title: '没有下一页',});
    }
    // console.log("还有")
    this.QueryParams.pagenum++
    this.getGoodsList()
  },

  //下拉刷新事件
  onPullDownRefresh(){
    // console.log("刷新")
    //重置数组
    this.setData({
      goodsList:[]
    })
    //重置页码
    this.QueryParams.pagenum=1
    //重新发送请求
    this.getGoodsList()
  }

})