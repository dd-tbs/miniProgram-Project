/**
 *  1 给输入框绑定 只改变事件 input事件
 *    1 获取到输入框的值
 *    2 合法性判断 空字符过滤
 *    3 检验通过 把输入框的值发送给后台
 *    4 返回的数据打印到页面上
 * 
 *  2 防抖(防止抖动) 节流
 *    防抖 一般用于输入框中 防止重复输入 重复发送请求
 *    节流 一般是用在页面的下拉和上拉 (加载下一页)
 *    定时器 解决
 *    1 定义全局的定时器ID
 * 
 */

import { request } from "../../request/index.js"
import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goods:[],
    // 取消 按钮是否显示
    isFocus:false,
    //输入框的值
    inpValue:''
  },
  TimeId:-1,

  //输入框的值改变 触发的事件
  handleInput(e){
    // 1 获取输入框的值
    const {value}=e.detail
    // 2 检查合法性
    if(!value.trim()){
      this.setData({
        goods:[],
        isFocus:false
      })
      //值不合法
      return
    }

    //3 准备发送请求获取数据
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId=setTimeout(()=>{
      this.qsearch(value)
    },1000)
    
  },


  //发送请求获取搜索建议 数据
  async qsearch(query){
    const res=await request({url:"/goods/qsearch",data:{query}})
    console.log(res)
    this.setData({
      goods:res
    })
  },

  //点击取消按钮触发
  handleCancel(){
    this.setData({
      inpValue:'',
      isFocus:false,
      goods:[]
    })
  }

})