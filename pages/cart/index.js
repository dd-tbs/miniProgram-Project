/**
 * 1 获取用户的收货地址
 *  1 绑定点击监听
 *  X 2 调用小程序内置api  wx.chooseAddress 获取用户的收货地址 
 *  2 获取 用户对小程序所授予获取地址的权限 的状态说明  scope
 *    1 如果用户点击获取收货地址的提示框 的确定  authSetting  scope.address: true
 *      scope 值为 true  可以直接调用获取收货地址
 *    2 假设用户从来没有调用过 收货地址的api
 *      scope 值为 undefined  可以直接调用获取收货地址
 *    3 如果用户点击获取收货地址的提示框 的取消
 *      scope 值为 false 
 *      1 诱导用户自己打开 授权设置页面 wx.openSetting, 当用户重新给与 获取地址权限
 *      2 获取收货地址
      4 把获取到的收货地址存入到本地存储中

  2 页面加载完毕 onLaod  onShow
    1 获取本地存储中的地址数据
    2 把数据设置给data中的一个变量  
  
  3 onShow
    0 回到商品详情页面,第一次添加商品的时候,手动添加属性
      1 num=1
      2 checked=true
    1 获取缓存中的购物车数组
    2 把购物车数据填充到data中

  4 全选的实现 数据的展示
    1 onShow 中获取缓存中的购物车数组
    2 根据购物车中的商品数据进行计算 (所有的商品都被选中checked=true,全选被选中)

  5 总价格和总数量
    1 都需要商品被选中才会计算
    2 获取到购物车数组
    3 遍历
    4 判断商品是否被选中
    5 总价格 += 商品单价 * 商品数量
      总数量 += 商品的数量
    6 把计算后的价格和数量设置回data中即可
  

  6 商品的选中
    1 绑定change事件
    2 获取到被修改的商品对象
    3 商品对象的选中状态 取反
    4 当对象被改变 重新填充进data中和缓存中
    5 重新计算 全选 总数量 总价格...


  7 全选和反选
    1 全选框绑定change事件
    2 获取 data 中的全选变量  allChecked
    3 直接取反
    4 遍历购物车数组 ,让里面的商品的状态跟随 allChecked 的改变而改变
    5 购物车数组 和 allChecked 重新设置回data 把购物车重新设置回缓存

  8 商品数量的编辑
    1 '+' '-' 按钮 绑定同一个点击事件 区分的关键在自定义属性
      点击 + 属性值为+1
      点击 - 属性值为-1
    2 传递被点击的商品id goods_id
    3 获取data 中的购物车数组,通过id找到需要被修改的商品对象
      当 购物车数量为 1 时,用户点击'-' 
      弹窗(showModal)提示询问用户 是否要删除
      1 确定 删除商品
      2 取消 什么都不做
    4 直接修改商品对象的数量 num
    5 把购物车数组重新设置回缓存和data


  9 点击结算
    1 判断用户有没有收货地址信息
    2 判断有没有选购商品
    3 经过以上验证,跳转支付页面
 */ 

 import { getSetting,chooseAddress,openSetting,showModal,showToast } from "../../utils/asyncWx.js"
 import regeneratorRuntime from '../../lib/runtime/runtime';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address:{},
    cart:[],
    allChecked:false,
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
    const cart=wx.getStorageSync("cart") || [];
    // 计算全选
      //every 数组方法 会遍历,会接受一个回调函数,每个回调函数都返回true 那么every方法返回的值为 true
      //只要有一个回调函数返回 false,那就不会再循环执行,直接返回false
      // 空数组调用了 every ,返回值也是true
    // const allChecked=cart.length?cart.every(v=>v.checked):false
    this.setData({address})
    this.setCart(cart)
  },

  //点击添加收货地址
  async handleChooseAddress(){
    /** 
    // 1 获取权限状态
    wx.getSetting({
      success: (result)=>{
        //获取权限状态 scope.address是一个属性名,这里要用[]的形式来获取属性值
        const scopeAddress=result.authSetting["scope.address"]
        if(scopeAddress===true || scopeAddress===undefined){
          wx.chooseAddress({
            success: (result2)=>{
              console.log(result2)
            }
          });
        }else{
          //用户之前拒绝过授权 ,先诱导用户打开授权页面
          wx.openSetting({
            success: (result3)=>{
              //可以直接调用 获取收货地址代码
              wx.chooseAddress({
                success: (result4)=>{
                  console.log(result4)
                }
              });
            }
          });
        }
      },
      fail: ()=>{},
      complete: ()=>{}
    });
  */
    try {
      //1 获取权限状态
      const res1 = await getSetting()
      const scopeAddress=res1.authSetting["scope.address"]
      //2 判断权限状态
      if(scopeAddress===false){
        //诱导用户打开授权页面
        await openSetting()
      }
      //3 调用获取收货地址的api
      let address=await chooseAddress()
      address.all = address.provinceName+address.cityName+address.countyName+address.detailInfo
      //把获取到的收货地址存储到本地
      wx.setStorageSync("address", address);
    } catch (error) {
      console.log(error)
    }
  },

  //商品的选中
  handleItemChange(e){
    //获取被修改的商品的id
    const goods_id=e.currentTarget.dataset.id
    // console.log(goods_id)
    //获取购物车数组
    let {cart}=this.data
    //找到被修改的商品对象
    let index=cart.findIndex(v=>v.goods_id===goods_id)
    //选中状态取反
    cart[index].checked = !cart[index].checked

    this.setCart(cart)
    
  },


  //设置购物车状态的同时 重新计算 底部工具栏的数据 全选 总价格 总数量..
  setCart(cart){   
    let allChecked=true
    // 总价格 总数量
    let totalPrice=0
    let totalNum=0
    cart.forEach(v=>{
      if(v.checked){
        totalPrice += v.num*v.goods_price
        totalNum += v.num
      }else{
        allChecked=false
      }
    })
    //判断数组是否为空
    allChecked=cart.length != 0?allChecked:false
    this.setData({
      cart,
      totalPrice,
      totalNum,
      allChecked
    })
    wx.setStorageSync("cart", cart);
  },


  //商品的全选功能
  handleItemAllCheck(){
    //获取data中的数据
    let {cart,allChecked} = this.data
    //取反
    allChecked = !allChecked
    //循环修改cart数组中的商品选中状态
    cart.forEach(v=>v.checked=allChecked)
    //把修改后的值 填充回data 和 缓存中
    this.setCart(cart)

  },

  //点击 + - 对商品数量的编辑
  async handleItemNumEdit(e){
    //获取传递过来的参数
    const {operation,id} = e.currentTarget.dataset
    // console.log(operation,id)
    //获取购物车数组
    let {cart} = this.data
    //找到需要修改的商品的索引
    const index=cart.findIndex(v=>v.goods_id===id)
    //判断是否删除商品
    if(cart[index].num===1&&operation===-1){
      //弹窗提示
      const res=await showModal({content:"是否删除该商品?"})
      if(res.confirm){
       cart.splice(index,1)
       this.setCart(cart)     
      }
    }else{
       //修改数量
      cart[index].num+=operation
      //把购物车设置回缓存
      this.setCart(cart)
    }  
  },

  // 点击结算
  async handlePay(){
    //判断有没有收货地址
    const {address,totalNum}=this.data
    if(!address.userName){
      await showToast({title:"您还没有选择收货地址"})
      return
    }
    //判断用户有没有选购商品
    if(totalNum===0){
      await showToast({title:"您还没有选购商品"})
      return
    }

    //跳转到支付页面
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})